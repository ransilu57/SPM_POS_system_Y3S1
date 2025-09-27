import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import productsRoutes from "./routes/products.js";
import cashierRoutes from "./routes/cashiers.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:5001",
      "http://localhost:5000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
  })
);

// Explicitly handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cashiers", cashierRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
