import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(
  cors({
    origin: process.env.CORS_URI,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRoute from "./routes/user.route.js";

// routes declaration
app.use("/api/v1/users", userRoute);
