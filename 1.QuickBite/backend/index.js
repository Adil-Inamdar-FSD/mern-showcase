import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";

import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

// 🔥 MUST be EXACT frontend URL (no trailing slash issues)
const FRONTEND_URL = "https://quickbite-frontend-958j.onrender.com";

// =======================
// 🔥 CORS FIX (CRITICAL)
// =======================
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(cookieParser());

// =======================
// Routes
// =======================
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// =======================
// Socket.IO FIX
// =======================
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.set("io", io);

socketHandler(io);

// =======================
// DB + SERVER START
// =======================
const port = process.env.PORT || 5000;

server.listen(port, async () => {
  await connectDb();
  console.log(`🚀 Server started on port ${port}`);
});
