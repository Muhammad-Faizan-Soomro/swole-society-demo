import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex lg:justify-around justify-center items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="mx-2 lg:mx-0">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            Your cart is empty!!{" "}
            <Link to="/shop" className="underline">
              Click Here To Go To Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:w-[80%]">
              <h1 className="text-xl lg:text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div
                  key={item.data._id}
                  className="flex items-center mb-[1rem] pb-2"
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item.data.image}
                      alt={item.data.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link
                      to={`/product/${item.data._id}`}
                      className="text-black"
                    >
                      {item.data.name}
                    </Link>

                    <div className="mt-2 text-black font-semibold lg:font-bold">
                      PKR {item.data.price}
                    </div>
                  </div>

                  <div className="w-[3rem] lg:w-24">
                    <select
                      className="w-full p-1 border-2 border-black rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.data.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 lg:mr-[5rem]"
                      onClick={() => removeFromCartHandler(item.data._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 lg:w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-lg lg:text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-xl lg:text-2xl font-bold">
                    PKR{" "}
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.qty * item.data.price,
                        0
                      )
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-[75vw] lg:w-full hover:bg-pink-900 text-white"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
