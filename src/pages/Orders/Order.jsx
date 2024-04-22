import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetUserDetailsQuery } from "../../redux/api/usersApiSlice";
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

  const { data: userOrderName } = useGetUserDetailsQuery(
    order?.data?.user?._id
  );

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
    <div className="mx-2 lg:mx-0 lg:container lg:ml-[8rem] lg:w-[90vw]">
      <div className="lg:w-2/3 lg:pr-4">
        <div className="border-black mt-5 pb-4 mb-5">
          {order.data.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mt-4 lg:mt-0">
                <thead className="border-b-2 border-black">
                  <tr>
                    <th className="px-1 py-2 text-left lg:align-top font-bold">
                      Image
                    </th>
                    <th className="px-1 py-2 text-left font-bold">Product</th>
                    <th className="px-1 py-2 text-left font-bold">Quantity</th>
                    <th className="px-1 py-2 text-left font-bold">Price</th>
                    <th className="px-1 py-2 text-left font-bold">Total</th>
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

                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">{item.price}</td>
                      <td className="p-2">
                        PKR {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-around flex-wrap">
        <div>
          <div className="mt-5 border-gray-300 border-2 p-4 mb-4 lg:w-[30vw]">
            <h2 className="text-xl font-bold mb-2">Shipping</h2>
            <p className="mb-4 mt-4">
              <strong className="text-pink-500">Order:</strong> {order.data._id}
            </p>

            <p className="mb-4">
              <strong className="text-pink-500">Name:</strong>{" "}
              {userOrderName?.data?.firstName} {userOrderName?.data?.lastName}
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
              <strong className="text-pink-500">Contact #:</strong>{" "}
              {order.data.shippingAddress.phoneNumber}
            </p>

            <p className="mb-4">
              <strong className="text-pink-500">
                Method: <span className="text-black">Cash On Delivery</span>
              </strong>
            </p>

            {order.data.isDelivered ? (
              <Messsage variant="success">
                Delivered on{" "}
                {moment(order.data.deliveredAt).format("DD/MM/YY HH:mm")}
              </Messsage>
            ) : (
              <Messsage variant="danger">Not Delivered</Messsage>
            )}
          </div>
        </div>
        <div className="border-2 border-gray-300 mt-5 p-4 lg:w-[30vw]">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>PKR {order.data.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>PKR 250</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>PKR {order.data.itemsPrice + 250}</span>
          </div>

          {loadingDeliver && <Loader />}
          {userInfo &&
            userInfo.data.user.isAdmin &&
            !order.data.isDelivered && (
              <div>
                <button
                  type="button"
                  className="bg-pink-500 text-white w-full py-2 hover:bg-pink-900"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Order;
