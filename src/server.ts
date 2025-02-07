import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./main-structure/routes/userRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import { logger } from "./middleware/loggerMiddleware";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Initialize Prisma (ORM)
const prisma = new PrismaClient();

// Middleware: Logging requests
app.use(logger);

// Middleware: Body parsing & security
app.use(express.json()); // Parsing JSON
app.use(cors({ origin: CORS_ORIGIN })); // CORS policy
app.use(helmet()); // Enhanced security
app.use(morgan("dev")); // Logging HTTP requests

// Rate limiting (anti-brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// API Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/api/users", userRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Database connected successfully`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error}`);
  }

  console.log(`✅ Server running at http://localhost:${PORT}`);
});
