import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
//import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
  const [colorOne, setColorOne] = useState("");
  const [colorTwo, setColorTwo] = useState("");
  const [colorThree, setColorThree] = useState("");
  const [colorFour, setColorFour] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // let productData = new FormData();
  //     // productData.append("imageLocalPath", image);
  //     // productData.append("name", name);
  //     // productData.append("description", description);
  //     // productData.append("price", price);
  //     // productData.append("category", category);
  //     // productData.append("quantity", quantity);
  //     // productData.append("countInStock", stock);
  //     const { data } = await createProduct({
  //       name,
  //       imageLocalPath: image,
  //       description,
  //       price,
  //       category,
  //       countInStock: stock,
  //       quantity,
  //     });

  //     if (data.error) {
  //       toast.error("Product create failed. Try Again.");
  //     } else {
  //       toast.success(`${data.name} is created`);
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Product create failed. Try Again.");
  //   }
  // };

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", imageOne);
    formData.append("image", imageTwo);
    formData.append("image", imageThree);
    formData.append("image", imageFour);
    try {
      setLoading(true);
      const res = await uploadProductImage(formData).unwrap();
      const images = [
        { url: res.image[0], color: colorOne },
        { url: res.image[1], color: colorTwo },
        { url: res.image[2], color: colorThree },
        { url: res.image[3], color: colorFour },
      ];
      const { data } = await createProduct({
        name,
        imageLocalPath: images,
        description,
        price,
        category,
        countInStock: stock,
        quantity,
      });
      if (data.error) {
        setLoading(false);
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="lg:mx-[8rem] mt-5">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="h-12">Create Product</div>
          <div className="mb-3 flex gap-x-4">
            <label className="border-2 border-black text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {imageOne ? imageOne.name : "Upload Image 1"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImageOne(e.target.files[0])}
                className={
                  !imageOne ? "hidden" : "text-black w-[70vw] max-w-[20rem]"
                }
              />
            </label>
            <input
              placeholder="Color of Image 1"
              type="text"
              className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
              value={colorOne}
              onChange={(e) => setColorOne(e.target.value)}
            />
          </div>
          <div className="mb-3 flex gap-x-3">
            <label className="border-2 border-black text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {imageTwo ? imageTwo.name : "Upload Image 2"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImageTwo(e.target.files[0])}
                className={
                  !imageTwo ? "hidden" : "text-black w-[70vw] max-w-[20rem]"
                }
              />
            </label>
            <input
              placeholder="Color of Image 2"
              type="text"
              className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
              value={colorTwo}
              onChange={(e) => setColorTwo(e.target.value)}
            />
          </div>
          <div className="mb-3 flex gap-x-3">
            <label className="border-2 border-black text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {imageThree ? imageThree.name : "Upload Image 3"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImageThree(e.target.files[0])}
                className={
                  !imageThree ? "hidden" : "text-black w-[70vw] max-w-[20rem]"
                }
              />
            </label>
            <input
              placeholder="Color of Image 3"
              type="text"
              className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
              value={colorThree}
              onChange={(e) => setColorThree(e.target.value)}
            />
          </div>
          <div className="mb-3 flex gap-x-3">
            <label className="border-2 border-black text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {imageFour ? imageFour.name : "Upload Image 4"}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImageFour(e.target.files[0])}
                className={
                  !imageFour ? "hidden" : "text-black w-[70vw] max-w-[20rem]"
                }
              />
            </label>
            <input
              placeholder="Color of Image 4"
              type="text"
              className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
              value={colorFour}
              onChange={(e) => setColorFour(e.target.value)}
            />
          </div>

          <div className="">
            <div className="flex flex-col md:flex-row gap-x-6">
              <div className="one">
                <label htmlFor="name">Name</label> <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two lg:ml-10 ">
                <label htmlFor="name block">Price</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Quantity</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-white border-2 border-black rounded-lg w-[95%] text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between flex-col lg:flex-row">
              <div>
                <label htmlFor="name block">Count In Stock</label> <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="">Category</label> <br />
                <select
                  id="select"
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[70vw] max-w-[20rem] border-2 border-black rounded-lg bg-white text-black"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.data.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={uploadFileHandler}
              disabled={loading}
              className="py-4 px-10 mt-5 rounded-full text-white hover:bg-pink-900 text-lg font-bold bg-pink-600"
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
