import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // for forms returning json response

app.use(express.urlencoded({ extended: true })); // for params & for other response then json

const __dirname = path.resolve();

app.use("/public/temp", express.static(path.join(__dirname + "/public/temp")));

//app.use(express.static(path.join(__dirname + "/public/temp"))); // for static files

app.use(cookieParser()); // for cookies

import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import orderRouter from "./routes/order.routes.js";

app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);

export { app };
