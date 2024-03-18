import { Router } from "express";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";
import formidable from "express-formidable";
import validateId from "../middlewares/validateId.middlewares.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductsById,
  getAllProducts,
  reviewProducts,
  fetchNewProducts,
  fetchTopProducts,
  filterProducts
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/all-products").get(verifyJWT, authorizeAdmin, getAllProducts);

router
  .route("/:id/reviews")
  .post(verifyJWT, validateId, reviewProducts);

router.route("/new").get(fetchNewProducts);

router.route("/top").get(fetchTopProducts);

router
  .route("/")
  .post(verifyJWT, authorizeAdmin, addProduct)
  .get(fetchProducts);

router
  .route("/:id")
  .put(verifyJWT, authorizeAdmin, updateProduct)
  .delete(verifyJWT, authorizeAdmin, deleteProduct)
  .get(fetchProductsById);

router.route("/filtered-products").post(filterProducts)
export default router;
