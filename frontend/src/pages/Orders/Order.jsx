import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from 'moment'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);


  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.data.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.data.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order.data._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {userInfo.data.user.firstName}{" "}{userInfo.data.user.lastName}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong>{" "}
            {order.data.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.data.shippingAddress.address},{" "}
            {order.data.shippingAddress.city}{" "}
            {order.data.shippingAddress.postalCode},{" "}
            {order.data.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method: Cash On Delivery</strong>
          </p>

          {order.data.isDelivered ? (
            <Messsage variant="success">
              Delivered on {moment(order.data.deliveredAt).format("DD/MM/YY HH:mm")}
            </Messsage>
          ) : (
            <Messsage variant="danger">Not Delivered</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.data.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.data.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.data.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.data.totalPrice}</span>
        </div>

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.data.user.isAdmin && !order.data.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
