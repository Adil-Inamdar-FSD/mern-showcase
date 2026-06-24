const express = require("express");
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
const connectDb = require("./config/db");
const app = express();
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/product", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", prescriptionRoutes);
app.use("/api", appointmentRoutes);

connectDb();
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
