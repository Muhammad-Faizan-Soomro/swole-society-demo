import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaBackward,
} from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const [colors, setColors] = useState(localStorage.getItem("colors") || "");
  const [sizeDiv, setSizeDiv] = useState(false);
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty, colors }));
    navigate("/cart");
  };

  const changeColor = (color) => {
    setColors(color);
    localStorage.setItem("colors", color);
  };

  return (
    <>
      <div className="ml-[8rem] gap-2 hidden lg:flex">
        <FaBackward size={18} />

        <Link
          to="/shop"
          className="text-black font-semibold hover:underline -mt-1"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:relative mt-[2rem] lg:ml-[8rem] overflow-hidden">
            <div>
              <img
                src={product.data.image[0].url}
                alt={product.data.name}
                className="w-[90vw] xl:w-[50rem] lg:w-[45rem] lg:mb-4 m-2 mx-auto lg:mx-0"
              />
            </div>

            {sizeDiv ? (
              <div className="flex flex-col ml-2 gap-y-3 mt-2">
                <img
                  src="https://res.cloudinary.com/dq69j0hgr/image/upload/v1713725823/1713724980166_1_w9erkp.webp"
                  alt="Size Chart"
                  className="h-[65vh] w-[90%] lg:ml-0 ml-2"
                />
                <span
                  onClick={() => setSizeDiv(!sizeDiv)}
                  className="mt-2 underline cursor-pointer hover:translate-y-1"
                >
                  {sizeDiv ? "Hide Size Chart" : "View Size Chart"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col ml-2 gap-y-3">
                <h2 className="lg:text-xl lg:ml-0 font-semibold mt-3">
                  Batman compression tee
                </h2>

                <p className="text-2xl lg:text-3xl lg:font-extrabold font-semibold ">
                  PKR {product.data.price}
                </p>

                <p className="xl:w-[35vw] lg:w-[35vw] text-black opacity-85 lg:ml-0">
                  The compression fabric locks in warmth and provides a snug fit
                  to keep you comfortable and protected in cooler climates..
                  Made from high quality fabric, this compression shirt offers
                  enhanced fit and breathability for optimal performance. -
                  Ultra tight fit - Second skin feel - Rapid moisture absorption
                  for quick sweat evaporation.{" "}
                </p>

                <h1 className="flex items-center mt-4 lg:-mx-24 ml-2 lg:ml-0">
                  <FaBox className="mr-2 text-black" /> In Stock:{" "}
                  {product.data.countInStock}
                </h1>

                <div className="flex items-center mt-4 gap-2">
                  <div className="mr-16">Size: </div>
                  <div
                    onClick={() => changeColor("small")}
                    className={`${
                      colors == "small"
                        ? "p-1 bg-black text-white"
                        : "border-2 border-black"
                    } text-sm p-1 cursor-pointer`}
                  >
                    Small
                  </div>
                  <div
                    onClick={() => changeColor("medium")}
                    className={`${
                      colors == "medium"
                        ? "bg-black text-white p-1"
                        : "border-2 border-black"
                    } text-xs p-1 cursor-pointer`}
                  >
                    Medium
                  </div>
                  <div className="line-through border-2 border-black">
                    Large
                  </div>
                </div>
                <span
                  onClick={() => setSizeDiv(!sizeDiv)}
                  className="mt-2 underline cursor-pointer hover:translate-y-1"
                >
                  {sizeDiv ? "Hide Size Chart" : "View Size Chart"}
                </span>
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between flex-wrap mt-5 lg:mt-0 ml-2 lg:ml-0">
              <Ratings
                value={product.data.rating}
                text={`${product.data.numReviews} reviews`}
              />

              {product.data.countInStock > 0 && (
                <div className="flex gap-4 items-center mt-4 lg:mt-0 ml-2 lg:ml-0">
                  <label>Quantity</label>
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="p-2 w-[6rem] rounded-lg text-black border-black border-2"
                  >
                    {[...Array(product.data.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <div className="btn-container">
                    <button
                      onClick={addToCartHandler}
                      disabled={product.data.countInStock === 0}
                      className="bg-pink-600 text-white py-2 px-4 rounded-lg md:mt-0 hover:bg-pink-900"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:mt-[5rem] mt-4  flex flex-wrap lg:justify-between lg:ml-[8rem] lg:items-center">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
