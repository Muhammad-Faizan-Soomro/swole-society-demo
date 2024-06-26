import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap justify-center items-center md:justify-around md:mx-5 lg:mx-14">
            <h1 className="w-[80vw] text-center mt-[5rem] text-[8vw] md:text-[4vw] md:w-[30vw] lg:ml-[4vw] xl:text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className=" bg-pink-600 font-bold rounded-full py-2 px-[10vw] mt-[2rem] md:px-10 md:mr-[0vw] md:ml-[0rem] md:mt-[5rem] lg:ml-[15vw] text-white hover:bg-pink-900"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem] w-[100%] md:grid md:grid-cols-2 lg:w-[90vw] lg:flex lg:ml-[8vw]">
              {data.data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;