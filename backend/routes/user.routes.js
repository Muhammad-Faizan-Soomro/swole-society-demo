import express from "express";
import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
} from "../controllers/user.controllers.js";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/")
  .post(registerUser)
  .get(verifyJWT, authorizeAdmin, getAllUsers);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/profile")
  .get(verifyJWT, getCurrentUser)
  .put(verifyJWT, updateCurrentUser);

router
  .route("/:id")
  .get(verifyJWT, authorizeAdmin, getSingleUser)
  .delete(verifyJWT, authorizeAdmin, deleteSingleUser)
  .put(verifyJWT, authorizeAdmin, updateSingleUser);

export default router;
