import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { PORT } from "./constants.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(`ERROR: ${error}`);
  });
