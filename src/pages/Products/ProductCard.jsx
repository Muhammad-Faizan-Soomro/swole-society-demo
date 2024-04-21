import { Link, useSearchParams } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ProductCard = ({ p }) => {
  const [color, setColor] = useState("small");
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    console.log(product);
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  const changeColor = (color) => {
    setColor(color);
    localStorage.setItem("colors", color);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg shadow-black p-3">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            className="cursor-pointer w-full"
            src={p.image[0].url}
            alt={p.name}
            style={{ height: "50vh", objectFit: "contain" }}
          />
        </Link>
      </section>

      <div className="py-5">
        <div className="flex flex-col lg:flex-row justify-between">
          <h5 className="mb-2 text-xl">{p?.name}</h5>

          <p className=" font-semibold text-pink-500 text-sm lg:text-md mb-2 lg:mb-0">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "PKR",
            })}
          </p>
        </div>

        <p className="hidden lg:block mb-3 font-normal text-gray-600">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
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
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
