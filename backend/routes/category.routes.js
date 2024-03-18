import express from "express";
import { Router } from "express";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  readCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, authorizeAdmin, createCategory);

router.route("/all-categories").get(getAllCategories);

router
  .route("/:id")
  .put(verifyJWT, authorizeAdmin, updateCategory)
  .delete(verifyJWT, authorizeAdmin, deleteCategory)
  .get(readCategory);

export default router;
