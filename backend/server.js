import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
//for files, you need to have the .js extension (not for package imports like above)

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); //this'll allow us to accept json data in the body using Postman

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

//this PayPal route is basically like a config route but we're just gonna place it here
//when we're readu to make our payment, we'll hit this route & fetch this client id
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
//,join() is to join different sgments of files. __dirname from node.js points to the current directory, but if we're using ES modules it's not available (it's only for common JS, the required syntax), but we can mimic __dirname using path.resolve on a __dirname variable & it'll act in the same way
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); //to make a folder static, all this is doing is taking us to that /uploads folder

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    //res.sendFile transfers the file to the given path so first __dirname, then 'frontend', then 'build', & finally 'index.html'
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
