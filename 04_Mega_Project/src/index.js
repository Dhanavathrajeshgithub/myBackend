import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/db.js";
import { app } from "./app.js";
connectDB()
  .then((res) => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log("Error connecting DB");
  });
app.listen(process.env.PORT || 8000, () => {
  console.log(`app is listening to the port ${process.env.PORT}`);
});
