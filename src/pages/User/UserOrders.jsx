import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="lg:container lg:ml-[8rem] mt-8 lg:w-[90vw]">
      <h2 className="text-2xl font-semibold mb-4 ml-4 lg:ml-0">My Orders </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="overflow-x-auto lg:ml-[8rem] mx-3 lg:mx-0">
          <table className="w-full border-collapse">
            <thead className="">
              <tr>
                <td className="px-1 py-2 text-left align-top font-bold">
                  Image
                </td>
                <td className="px-1 py-2 text-left font-bold">Date</td>
                <td className="px-1 py-2 text-left font-bold">Total</td>
                <td className="px-1 py-2 text-left font-bold">Delivered</td>
                <td className="px-1 py-2 text-left font-bold"></td>
              </tr>
            </thead>

            <tbody>
              {orders.data.map((order) => (
                <tr key={order._id}>
                  <td className="p-2 pb-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-16 h-16 object-cover"
                    />
                  </td>

                  <td className="p-2 pb-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-2 pb-4">PKR {order.totalPrice}</td>

                  <td className="p-2 pb-4">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>

                  <td className="p-2 pb-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-400 text-back py-2 px-3 rounded w-[7rem] text-white hover:bg-pink-900">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
