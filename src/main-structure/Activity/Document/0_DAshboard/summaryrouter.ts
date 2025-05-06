// src/main-structure/Activity/Document/0_DAshboard/RouterDashboard.ts

import express from 'express';
import { 
  getDocumentSummary, 
  getTopRatedProjects,
  getDepartmentMetrics,
  getTopCreators,
  getCompletionTrend
} from './Summary';

const router = express.Router();

// Dashboard API routes
router.get('/dashboard/summary', getDocumentSummary);
router.get('/dashboard/top-rated-projects', getTopRatedProjects);
router.get('/dashboard/department-metrics', getDepartmentMetrics);
router.get('/dashboard/top-creators', getTopCreators);
router.get('/dashboard/completion-trend', getCompletionTrend);

export default router;