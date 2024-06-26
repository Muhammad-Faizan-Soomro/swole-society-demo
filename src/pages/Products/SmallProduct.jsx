import { Link } from "react-router-dom";
// import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[100vw] md:w-[60vw] lg:w-[20rem] lg:ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.image[0].url}
          alt={product.name}
          className="h-auto rounded"
        />
        {/* <HeartIcon product={product} /> */}
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="hover:underline">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
              PKR {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;