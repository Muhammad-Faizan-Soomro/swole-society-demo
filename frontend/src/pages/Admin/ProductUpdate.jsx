import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData, isLoading } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.data.image);
  const [name, setName] = useState(productData?.data.name);
  const [description, setDescription] = useState(productData?.data.description);
  const [price, setPrice] = useState(productData?.data.price);
  const [category, setCategory] = useState(productData?.data.category);
  const [quantity, setQuantity] = useState(productData?.data.quantity);
  const [stock, setStock] = useState(productData?.data.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData.data._id) {
      setName(productData.data.name);
      setDescription(productData.data.description);
      setPrice(productData.data.price);
      setCategory(productData.data.category?._id);
      setQuantity(productData.data.quantity);
      setStock(productData.data.countInStock);
      setImage(productData.data.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", image);
    // formData.append("name", name);
    // formData.append("description", description);
    // formData.append("price", price);
    // formData.append("category", category);
    // formData.append("quantity", quantity);
    // formData.append("countInStock", stock);

    // console.log(formData)

    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      console.log(res);
      const { data } = await updateProduct({
        productId: params._id,
        formData: {
          name,
          imageLocalPath: res.image,
          description,
          price,
          category,
          countInStock: stock,
          quantity,
        },
      });
      if (data.error) {
        toast.error("Product update failed. Try Again.");
      } else {
        toast.success(`${data.data.name} is updated`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      await deleteProduct(params._id);
      toast.success(`product is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container  xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/4 p-3">
            <div className="h-12">Update / Delete Product</div>

            <div className="mb-3">
              <label className="text-black  py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className={!image ? "hidden" : "text-black"}
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black mr-[5rem]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="two">
                  <label htmlFor="name block">Price</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="name block">Quantity</label> <br />
                  <input
                    type="number"
                    min="1"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black mr-[5rem]"
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
                className="p-2 mb-3 bg-white  border rounded-lg w-[95%] text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black "
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="">Category</label> <br />
                  <select
                    placeholder="Choose Category"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black mr-[5rem]"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.data?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="">
                <button
                  onClick={uploadFileHandler}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-green-600 mr-6"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-pink-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;
