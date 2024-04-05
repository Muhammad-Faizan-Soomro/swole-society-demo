import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { useEffect } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [products]);

  if (isLoading) {
    return <div className="ml-[8rem]">Loading...</div>;
  }

  if (isError) {
    return <div className="ml-[8rem]">Error loading products.. Kindly logout and re-login</div>;
  }

  return (
    <>
      <div className="lg:mx-[8rem] mt-5 lg:mt-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-3">
            <div className="text-xl font-bold h-12">
              All Products ({products.data.length})
            </div>
            <div className="flex flex-wrap justify-between items-center">
              {products.data.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block mb-4 overflow-hidden"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-around">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">
                          {product?.name}
                        </h5>

                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-400 w-[30vw] text-sm mb-4">
                        {product?.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between gap-x-4">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="w-[5rem] lg:w-[6rem] lg:inline-flex lg:items-center px-3 py-2 text-sm text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300"
                        >
                          Update
                          <svg
                            className="w-3.5 h-3.5 ml-2 hidden lg:block"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p>PKR {product?.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
