import express from 'express';

import {
    createAuthDoc,
}
    from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Add'; // Pastikan path-nya benar


import {
    getAllAuthDoc,
    getAuthDocById,
}
    from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_List'; // Pastikan path-nya benar

import {
    getHistoryAuthDoc,
}
    from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_History'; // Pastikan path-nya benar

import {
    getApprovalListAuthDoc,
}
    from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Approvallist'; // Pastikan path-nya benar

import {
    getAuthDocByIdApprover,
    updateAuthApprovalStatus,
}
    from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Approver'; // Pastikan path-nya benar

    import {
  
        updateAuthDocById
    }
        from '../../main-structure/Activity/Document/4_Authorization_DOC/Authorization_Update'; // Pastikan path-nya benar
    

const router = express.Router();

//Post Buat Dokumen updateAuthDocById
router.post("/authdoc", createAuthDoc);

//List Authdoc
router.get("/authdoc", getAllAuthDoc);
router.get("/authdoc/:id", getAuthDocById);
router.put("/authdoc/:id", updateAuthDocById);



//Main History  getApprovalListAuthDoc
router.get("/history-byID-authdoc/:id", getHistoryAuthDoc);

router.get("/approval-byID-authdoc/:id", getApprovalListAuthDoc);



//Nyari by Approver yang mau mulai ngapprove updateAuthApprovalStatus
router.get('/authdocongoing', getAuthDocByIdApprover);
router.post('/authstatus', updateAuthApprovalStatus);

export default router;
