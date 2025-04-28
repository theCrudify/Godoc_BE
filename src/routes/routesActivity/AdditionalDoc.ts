import express from 'express';
import { upload } from "../../middleware/uploadMiddleware"; // naik satu folder karena kamu ada di routesActivity


import {
    SupergetProposedChangeById,
    insertDocumentNumber,
    updateDocumentNumber,
    searchByProposedChangeId

} from '../../main-structure/Activity/Document/3_Additional_DOC/AdditionalAfterProposedChanges';

import {
    getDocumentFilesByProposedChangeId,
    getDocumentFilesByDocId,
    uploadDocumentFile,
    downloadDocumentFile,
    viewDocumentFile,
    deleteDocumentFile,

} from '../../main-structure/Activity/Document/3_Additional_DOC/AddiotionalDoc_for_file';



const router = express.Router();

//Halaman Additional Doc  
router.get("/superproposed/:id", SupergetProposedChangeById);
router.post("/superproposed", insertDocumentNumber);
router.put("/superproposed/:id", updateDocumentNumber);
router.get('/additionalbyid/search', searchByProposedChangeId);


// Mendapatkan semua file berdasarkan proposed_change_id
// GET /api/additionalbyid/search?proposed_change_id=1
router.get('/additionalbyid/search', getDocumentFilesByProposedChangeId);

// Mendapatkan semua file berdasarkan tr_additional_doc_id
// GET /api/document/files?tr_additional_doc_id=1
router.get('/document/files', getDocumentFilesByDocId);

// Upload file baru untuk dokumen
// POST /api/document/files
router.post('/documents/upload', upload.single('file'), uploadDocumentFile);

// Download file dokumen
// GET /api/document/files/download/:fileId
router.get('/document/files/download/:fileId', downloadDocumentFile);

// View file dokumen
// GET /api/document/files/view/:fileId
router.get('/document/files/view/:fileId', viewDocumentFile);

// Hapus file dokumen (soft delete)
// DELETE /api/document/files/:fileId
router.delete('/document/files/:fileId', deleteDocumentFile);

export default router;
