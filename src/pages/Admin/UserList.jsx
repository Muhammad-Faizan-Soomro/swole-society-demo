import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="p-24">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* <AdminMenu /> */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">FIRST NAME</th>
                <th className="px-4 py-2 text-left">LAST NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">
                    <div className="flex items-center">{user.firstName} </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">{user.lastName} </div>
                  </td>
                  <td className="px-4 py-2">
                    {" "}
                    <div className="flex items-center">
                      <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
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

export default UserList;
