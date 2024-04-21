import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./arrow.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar } from "react-icons/fa";

const ProductCarousel = (product) => {
  // const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    mobileFirst: true,
  };

  return (
    <div className="mb-4 block">
      <Slider {...settings} className="">
        {product.data.image.map((image) => (
          <div key={image.url}>
            <img
              src={image.url}
              alt="image"
              className="w-full rounded-lg object-contain h-[30rem]"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
