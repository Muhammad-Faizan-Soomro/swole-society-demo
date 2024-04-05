import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [orders]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="lg:ml-[9rem]">
          <div className="overflow-x-auto mx-2 lg:mx-0">
            <table className="w-full border-collapse">
              <thead className="border-2 border-black">
                <tr className="">
                  <th className="text-left pl-1">ITEMS</th>
                  <th className="text-left pl-1 hidden lg:block">USER</th>
                  <th className="text-left pl-1">DATE</th>
                  <th className="text-left pl-1 hidden lg:block">TOTAL</th>
                  <th className="text-left pl-1">DELIVERED</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-[3rem] lg:w-16 h-[3rem] lg:h-16 object-cover"
                      />
                    </td>

                    <td className="hidden lg:block">
                      {userInfo
                        ? `${userInfo.data.user.firstName} ${userInfo.data.user.lastName}`
                        : "N/A"}
                    </td>

                    <td>
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </td>

                    <td className="hidden lg:block">PKR {order.totalPrice}</td>

                    <td className="px-2 py-2">
                      {order.isDelivered ? (
                        <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full text-white">
                          Pending
                        </p>
                      )}
                    </td>

                    <td>
                      <Link to={`/order/${order._id}`}>
                        <button className="px-4 py-2 bg-pink-500 hover:bg-pink-900 rounded-full w-[5rem] text-white">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
