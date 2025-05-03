import express from 'express';

// Controller Imports (Pastikan semua path sudah benar)
import { createAuthDoc } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Add';
import { getAllAuthDoc, getAuthDocById } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_List';
import { getHistoryAuthDoc } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_History';
import { getApprovalListAuthDoc } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Approvallist';
import { getAuthDocByIdApprover, updateAuthApprovalStatus } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Approver';
import { updateAuthDocById } from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Update';
import { getAuthDocByAuthId } from '../../main-structure/Activity/Document/4_Authorization_DOC/filterAuthorization';

const router = express.Router();

/**
 * @route   POST /authdoc
 * @desc    Create a new Authorization Document
 */
router.post("/authdoc", createAuthDoc);

/**
 * @route   GET /authdoc
 * @desc    Get list of all Authorization Documents
 */
router.get("/authdoc", getAllAuthDoc);

/**
 * @route   GET /authdoc/:id
 * @desc    Get Authorization Document by ID
 */
router.get("/authdoc/:id", getAuthDocById);

/**
 * @route   PUT /authdoc/:id
 * @desc    Update Authorization Document by ID
 */
router.put("/authdoc/:id", updateAuthDocById);

/**
 * @route   GET /history-byID-authdoc/:id
 * @desc    Get history of a specific Authorization Document
 */
router.get("/history-byID-authdoc/:id", getHistoryAuthDoc);

/**
 * @route   GET /approval-byID-authdoc/:id
 * @desc    Get approval list of a specific Authorization Document
 */
router.get("/approval-byID-authdoc/:id", getApprovalListAuthDoc);

/**
 * @route   GET /authdocongoing
 * @desc    Get Authorization Documents that are currently pending for the approver
 */
router.get("/authdocongoing", getAuthDocByIdApprover);

/**
 * @route   POST /authstatus
 * @desc    Update the approval status of an Authorization Document
 */
router.post("/authstatus", updateAuthApprovalStatus);

/**
 * @route   GET /authdoc/by-auth/:id
 * @desc    Get Authorization Document(s) by authorization ID
 */
router.get("/authdoc/by-auth/:id", getAuthDocByAuthId);

export default router;
