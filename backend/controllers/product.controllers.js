import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import path from "path";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    quantity,
    countInStock,
    imageLocalPath,
  } = req.body;
  //const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "image is missing");
  }

  if (
    !name ||
    !description ||
    !price ||
    !quantity ||
    !category ||
    !countInStock
  ) {
    throw new ApiError(401, "all fields are required");
  }

  const __dirname = path.resolve();

  const image = await uploadOnCloundinary(imageLocalPath);

  if (!image) {
    throw new ApiError(
      500,
      "can not upload file on cloudinary due to some error"
    );
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    quantity,
    countInStock,
    image: image.url,
  });

  const createdProduct = await Product.findById(product._id);

  if (!createdProduct) {
    throw new ApiError(
      500,
      "can not create product due to some internal server error"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdProduct, "product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      countInStock,
      imageLocalPath,
    } = req.body;

    //const imageLocalPath = req.file?.path;

    const product = await Product.findById(req.params.id);

    let image;

    if (imageLocalPath) {
      image = await uploadOnCloundinary(imageLocalPath);

      if (!image) {
        throw new ApiError(
          500,
          "can not upload file on cloudinary due to some error"
        );
      }

      product.image = image.url || product.image;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;
    await product.save({ validateBeforeSave: false });

    if (!product) {
      throw new ApiError(
        500,
        "can not update product due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, "product updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(401, "product not found");
    }

    await Product.deleteOne({ _id: product._id });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "product deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          page: 1,
          pages: Math.ceil(count / pageSize),
          hasMore: false,
        },
        "products fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const fetchProductsById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(401, "product not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, "product fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, product, "all products fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const reviewProducts = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        throw new ApiError(400, "product already reviewed");
      }

      const review = {
        name: req.user.firstName,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      return res.status(201).json(new ApiResponse(200, {}, "review added"));
    } else {
      throw new ApiError(404, "product not found");
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    return res.status(200).json(new ApiResponse(200, products, "top products"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    return res.status(200).json(new ApiResponse(200, products, "new products"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    return res
      .status(200)
      .json(new ApiResponse(200, products, "filtered products"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, error.message);
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductsById,
  getAllProducts,
  reviewProducts,
  fetchNewProducts,
  fetchTopProducts,
  filterProducts,
};
