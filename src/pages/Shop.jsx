import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { FaFilter } from "react-icons/fa";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    if (showFilter === true) {
      setShowFilter(false);
    }
    if (showFilter === false) {
      setShowFilter(true);
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="flex pl-4 mt-2 gap-1">
          <FaFilter size={12} />

          <button className=" text-black text-sm -mt-1" onClick={toggleFilter}>
            FILTER
          </button>
        </div>
        {showFilter ? (
          <div className="h-fit w-[100vw]">
            <div className="bg-white p-3 mt-2 mb-2">
              <h2 className="h4 text-center py-2 bg-gray-300 rounded-full mb-2">
                Filter by Categories
              </h2>

              <div className="p-5 w-[15rem]">
                {categories.data?.map((c) =>
                  c.name != "-- Please Select Category --" ? (
                    <div key={c._id} className="mb-2">
                      <div className="flex ietms-center mr-4">
                        <input
                          type="checkbox"
                          id="red-checkbox"
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-4 h-4 text-pink-600 bg-black border-gray-300 rounded focus:ring-pink-50 focus:ring-2"
                        />

                        <label
                          htmlFor="pink-checkbox"
                          className="ml-2 text-sm font-medium text-black"
                        >
                          {c.name}
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>

              <h2 className="h4 text-center py-2 bg-gray-300 rounded-full mb-2">
                Filer by Price
              </h2>

              <div className="p-5 w-[15rem]">
                <input
                  type="text"
                  placeholder="Enter Price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-[80vw] px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300 border-black"
                />
              </div>

              <div className="p-5 pt-0">
                <button
                  className="w-full border my-4 bg-black text-white rounded-md p-1 hover:opacity-75"
                  onClick={() => window.location.reload()}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex flex-row">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-2" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block container pl-20 mx-auto">
        <div className="flex lg:flex-row">
          <div className="bg-white p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-gray-300 rounded-full mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories.data?.map((c) =>
                c.name != "-- Please Select Category --" ? (
                  <div key={c._id} className="mb-2">
                    <div className="flex ietms-center mr-4">
                      <input
                        type="checkbox"
                        id="red-checkbox"
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-pink-600 bg-black border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                      />

                      <label
                        htmlFor="pink-checkbox"
                        className="ml-2 text-sm font-medium text-black"
                      >
                        {c.name}
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>

            <h2 className="h4 text-center py-2 bg-gray-300 rounded-full mb-2">
              Filer by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300 border-black"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4 bg-black text-white rounded-md p-1 hover:opacity-75"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap justify-between mx-8">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
