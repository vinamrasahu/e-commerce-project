import "dotenv/config"; 
 
 import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authroute.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import blogRoutes from"./routes/blogRoutes.js"
 import sliderRoutes from "./routes/sliderRoutes.js"
 import cartRoutes from "./routes/cartRoutes.js"
  import contactRoutes from "./routes/contactRoutes.js"
  import likeRoutes from "./routes/likeRoutes.js";
import adminRoutes from "./routes/adminroutes.js"
import notificationRoutes from "./routes/notificationRoutes.js";
import orderroute from "./routes/orderroute.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import collectionRoutes from "./routes/collectionRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("public/uploads"));
app.use("/api/sliders", sliderRoutes);
app.use("/api", uploadRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/orders",  orderroute )
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/menu", menuRoutes);
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/admin", adminRoutes);


app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});