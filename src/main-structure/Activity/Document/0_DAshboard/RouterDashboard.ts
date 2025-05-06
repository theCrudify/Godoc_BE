// src/routes/routesDashboard.ts

import express from "express";
import { getDashboardOverview } from "./DashboardOverview";
import { getApprovalMonitorData } from "./ApprovalMonitor";
import { getDepartmentPerformance } from "./DepartmentPerformance";
import { getContributorPerformance } from "./ContributorPerformance";
import { getAreaActivityData } from "./AreaActivityMonitor";
// import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// Apply middleware for all dashboard routes
// router.use(verifyToken);

// Dashboard Overview
router.get("/overview", getDashboardOverview);

// Approval Monitor
router.get("/approval-monitor", getApprovalMonitorData);

// Department Performance
router.get("/department-performance", getDepartmentPerformance);

// Individual Contributor Performance
router.get("/contributor-performance", getContributorPerformance);

// Area Activity Monitor
router.get("/area-activity", getAreaActivityData);

export default router;