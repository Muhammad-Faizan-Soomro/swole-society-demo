import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res.data._id}`);
    } catch (error) {
      toast.error("Can not place order, try again.");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="lg:container lg:ml-[8rem] mt-8 lg:w-[90vw]">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto lg:ml-[8rem] mx-3 lg:mx-0">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top font-bold">
                    Image
                  </td>
                  <td className="px-1 py-2 text-left font-bold">Product</td>
                  <td className="px-1 py-2 text-left font-bold">Quantity</td>
                  <td className="px-1 py-2 text-left font-bold">Size</td>
                  <td className="px-1 py-2 text-left font-bold">Price</td>
                  <td className="px-1 py-2 text-left font-bold">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.data.image[0].url}
                        alt={item.data.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/${item.data.product}`}>
                        {item.data.name}
                      </Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.colors}</td>
                    <td className="p-2">PKR {item.data.price.toFixed(2)}</td>
                    <td className="p-2">
                      PKR {(item.qty * item.data.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 mx-[10vw] lg:mx-0">
          <div className="lg:flex justify-center lg:justify-around flex-wrap bg-white">
            <ul className="text-lg">
              <h2 className="text-xl lg:text-2xl font-semibold mb-5">
                Order Summary
              </h2>
              <li className="mb-2">
                <span className="font-semibold">Items:</span> PKR{" "}
                {cart.itemsPrice}
              </li>
              <li className="mb-2">
                <span className="font-semibold">Shipping:</span> PKR{" "}
                {cart.shippingPrice}
              </li>
              <li className="mb-2">
                <span className="font-semibold">Total:</span> PKR{" "}
                {cart.totalPrice}
              </li>
            </ul>

            {error && (
              <Message variant="danger">
                Some Error Occurred! Kindly Try Again.
              </Message>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-4 mt-4 lg:mt-0">
                Shipping
              </h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
              <p className="mt-2">
                <strong>Contact #:</strong> {cart.shippingAddress.phoneNumber}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 mt-4 lg:mt-0">
                Payment Method
              </h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg max-w-[20rem] w-[70vw] lg:w-[20vw] mt-4 hover:bg-pink-900 lg:right-0 lg:absolute lg:mr-16"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
