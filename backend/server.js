import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Config env
dotenv.config();

// Database connection
connectDB();

// Express app instance
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/currency", currencyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Root API endpoint
app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

// Define PORT
const PORT = process.env.PORT || 8080;

// Start the server and store the instance
const server = app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});

// ✅ Export app and server for testing
export { app, server };