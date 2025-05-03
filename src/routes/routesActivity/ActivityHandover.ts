import express from 'express';


import {
    createHandover,
} from
    '../../main-structure/Activity/Document/5_Handover_DOC/Add_HAndover'; // Pastikan path-nya benar

import {
    updateHandover,
} from
    '../../main-structure/Activity/Document/5_Handover_DOC/Update_HAndover'; // Pastikan path-nya benar

import {
    getHandoverById,
    getAllHandovers,
} from
    '../../main-structure/Activity/Document/5_Handover_DOC/List_HAndover'; // Pastikan path-nya benar

import {
    getHandoverByIdApprover,
    updateHandoverApprovalStatus
} from
    '../../main-structure/Activity/Document/5_Handover_DOC/Approver_Handover'; // Pastikan path-nya benar

import {
    getHandoverApproval

} from
    '../../main-structure/Activity/Document/5_Handover_DOC/Approvallist_HAndover'; // Pastikan path-nya benar



import {
    getHistoryHandover

} from
    '../../main-structure/Activity/Document/5_Handover_DOC/History_HAndover'; // Pastikan path-nya benar




const router = express.Router();

// Routes untuk pengguna getDocumentNumberById


router.post("/handover", createHandover);
router.put("/handover/:id", updateHandover);

router.get("/handover", getAllHandovers);
router.get("/handover/:id", getHandoverById);

router.get("/ongoinghandover", getHandoverByIdApprover);
router.post("/approvalhandover", updateHandoverApprovalStatus);


//Main History  dan approval handover
router.get("/history-byID-handover/:id", getHistoryHandover);

router.get("/approval-byID-handover/:id", getHandoverApproval);










export default router;
