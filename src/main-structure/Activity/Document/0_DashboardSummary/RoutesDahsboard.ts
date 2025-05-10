// src/main-structure/Activity/Document/0_DAshboard/RouterDashboard.ts

import express from 'express';
import { 
    getDocumentStatusMapping, 

} from './DocumentLevelling';

const router = express.Router();

// Dashboard API routes
router.get('/documentmapping', getDocumentStatusMapping);

export default router;