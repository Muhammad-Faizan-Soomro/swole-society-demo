import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, "Category name is required");
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({
      name,
    });

    const createdCategory = await Category.findById(category._id);

    if (!createdCategory) {
      throw new ApiError(
        500,
        "can not create category due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, createdCategory, "category created successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findById({ _id: id });

    category.name = name;

    await category.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, category, "cateory updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(401, "can not find category");
    }

    await Category.deleteOne({ _id: category._id });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "category deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});

    if (!categories) {
      throw new ApiError(
        500,
        "can not get all categories due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categories,
          "all categories retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "can not get all categories");
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(
        500,
        "can not retrieve category due to some internal server error"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "category retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "can not retrieve category");
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  readCategory,
};
