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
const CORS_ORIGIN = process.env.CORS_ORIGIN ;
// console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
// console.log("JWTSECRET:", process.env.JWT_SECRET);
// console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);

// Initialize Prisma (ORM)
const prisma = new PrismaClient();

// Middleware: Logging requests
app.use(logger);

// Middleware: Body parsing & security
app.use(express.json()); // Parsing JSON
app.use(cors({ origin: CORS_ORIGIN })); // CORS policy
app.use(helmet()); // Enhanced security
app.use(morgan("dev")); // Logging HTTP requests

// API Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/api/users", userRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Database connected successfully`);
  } catch (error) {
    console.error(`❌ Database connection failed:`, error);
  }

  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Graceful shutdown handling (Menutup Prisma saat server berhenti)
const shutdown = async (signal: string) => {
  console.log(`\n🔻 Received ${signal}. Closing server gracefully...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log("✅ Server shut down cleanly.");
    process.exit(0);
  });
};

// Menangani sinyal penghentian proses
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
