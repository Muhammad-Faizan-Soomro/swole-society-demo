import { Link } from "react-router-dom";
// import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="p-3 border-2 shadow-lg shadow-black border-black m-2 relative">
      <div className="relative">
        <img
          src={product.image[0].url}
          alt={product.name}
          className="w-full h-[50vh] object-contain rounded"
        />
        {/* <HeartIcon product={product} /> */}
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center -mx-3">
            <div className="text-lg hover:underline">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              PKR {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
