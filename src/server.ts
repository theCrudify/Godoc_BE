import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import userRoutes from "./routes/routesServer/userRoutes";
import LoginApps from "./routes/routesApps/routesApps";
import MasterCompany from "./routes/routesMaster/routesMasterORG";
import MasterDocument from "./routes/routesMaster/routesMasterDOC";

import DocumentNumbers from "./routes/routesActivity/ActivityDocumentNumber";
import ProposedChanges from "./routes/routesActivity/ActivityProposedChanges";
import AdditionalDoc from "./routes/routesActivity/AdditionalDoc";
import AuthDoc from "./routes/routesActivity/ActivityAuthDoc";
import Handover from "./routes/routesActivity/ActivityHandover";
import mappingdashboard from "./main-structure/Activity/Document/0_DashboardSummary/RoutesDahsboard";


import { errorHandler } from "./middleware/errorMiddleware";
import { logger } from "./middleware/loggerMiddleware";
import { prismaDB1, prismaDB2 } from "./config/database";
import { verifyToken } from "./middleware/authMiddleware";

import * as dotenv from "dotenv";


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

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

app.use("/api/users", userRoutes, LoginApps);

app.use("/api/", MasterCompany, MasterDocument); // All Master

app.use("/api/", DocumentNumbers, ProposedChanges, AdditionalDoc, AuthDoc, Handover, mappingdashboard); //Activity Pag

// Global Error Handling Middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, async () => {
  try {
    await prismaDB1.$connect();
    await prismaDB2.$connect();
    console.log(`✅ Database connected successfully`);
  } catch (error) {
    console.error(`❌ Database connection failed:`, error);
  }

  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Graceful shutdown handling (Menutup Prisma saat server berhenti)
const shutdown = async (signal: string) => {
  console.log(`\n🔻 Received ${signal}. Closing server gracefully...`);
  await prismaDB1.$disconnect();
  await prismaDB2.$disconnect();
  server.close(() => {
    console.log("✅ Server shut down cleanly.");
    process.exit(0);
  });
};

// Menangani sinyal penghentian proses
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

console.log("Jidan was here, thanks btw!"); // Tambahan buat seru-seruan aja 😆

















// import express from "express";
// import cluster from "cluster";
// import os from "os";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import * as dotenv from "dotenv";

// import { activityLogger } from "./middleware/logging";

// import userRoutes from "./routes/routesServer/userRoutes";
// import LoginApps from "./routes/routesApps/routesApps";
// import MasterCompany from "./routes/routesMaster/routesMasterORG";
// import MasterDocument from "./routes/routesMaster/routesMasterDOC";
// import DocumentNumbers from "./routes/routesActivity/ActivityDocumentNumber";
// import ProposedChanges from "./routes/routesActivity/ActivityProposedChanges";
// import AdditionalDoc from "./routes/routesActivity/AdditionalDoc";
// import AuthDoc from "./routes/routesActivity/ActivityAuthDoc";
// import Handover from "./routes/routesActivity/ActivityHandover";
// import { verifyToken } from "./middleware/authMiddleware";

// import { errorHandler } from "./middleware/errorMiddleware";
// import { logger } from "./middleware/loggerMiddleware";
// import { prismaDB1, prismaDB2 } from "./config/database";

// dotenv.config();

// const PORT = process.env.PORT;
// const CORS_ORIGIN = process.env.CORS_ORIGIN;
// const isDev = process.env.NODE_ENV;

// if (cluster.isPrimary) {
//   const totalCPUs = os.cpus().length;
//   console.log(`🔁 Primary ${process.pid} is running`);
//   console.log(`🚀 Forking ${totalCPUs} workers`);

//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
//   const app = express();

//   // Middleware
//   app.use(cors({ origin: CORS_ORIGIN }));
//   app.use(express.json());
//   app.use(helmet());
//   // if (isDev) app.use(morgan("dev"));
//   app.use(logger);

//   // Rate Limiting
//   const limiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: 5000,
//     message: "🚫 Too many requests, please slow down.",
//   });
//   app.use(limiter);

//   // app.use("/api/", verifyToken, activityLogger);

//   // Routes
//   app.use("/api/users", userRoutes, LoginApps);
//   app.use("/api/", MasterCompany, MasterDocument);
//   app.use("/api/", DocumentNumbers, ProposedChanges, AdditionalDoc, AuthDoc, Handover);


//   // Routes
//   // app.use("/api/users", userRoutes, LoginApps);
//   // app.use("/api/", verifyToken, MasterCompany, MasterDocument);
//   // app.use("/api/", verifyToken, DocumentNumbers, ProposedChanges, AdditionalDoc, AuthDoc, Handover);

//   // Error Handler
//   app.use(errorHandler);

//   const server = app.listen(PORT, async () => {
//     try {
//       await prismaDB1.$connect();
//       await prismaDB2.$connect();
//       console.log(`✅ DB connected | PID: ${process.pid}`);
//     } catch (err) {
//       console.error(`❌ DB failed to connect in PID ${process.pid}:`, err);
//     }
//     console.log(`✅ Server running at http://localhost:${PORT} | PID: ${process.pid}`);
//   });

//   // Graceful Shutdown
//   const shutdown = async (signal: string) => {
//     console.log(`🔻 Received ${signal}, cleaning up...`);
//     await prismaDB1.$disconnect();
//     await prismaDB2.$disconnect();
//     server.close(() => {
//       console.log(`✅ Server PID ${process.pid} shut down cleanly.`);
//       process.exit(0);
//     });
//   };

//   ["SIGINT", "SIGTERM"].forEach((signal) => {
//     process.on(signal, () => shutdown(signal));
//   });
// }
