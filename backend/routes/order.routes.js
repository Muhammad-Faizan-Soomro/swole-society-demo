import { Router } from "express";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  // markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/order.controllers.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, createOrder)
  .get(verifyJWT, authorizeAdmin, getAllOrders);

router.route("/my-orders").get(verifyJWT, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(verifyJWT, findOrderById);
// router.route("/:id/pay").put(verifyJWT, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(verifyJWT, authorizeAdmin, markOrderAsDelivered);

export default router;
