import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();

  return (
    <>
      <section className="lg:ml-[8rem]">
        <div className="flex justify-around flex-col md:flex-row">
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3 text-white">
              $
            </div>

            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              PKR {isLoading ? <Loader /> : sales.data.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] md:mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3 text-white">
              $
            </div>

            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {loading ? <Loader /> : customers?.data.length}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] md:mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3 text-white">
              $
            </div>

            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {loadingTwo ? <Loader /> : orders?.data}
            </h1>
          </div>
        </div>
      </section>
      <div className="mt-[2rem] lg:mt-[4rem]">
        <OrderList />
      </div>
    </>
  );
};

export default AdminDashboard;
