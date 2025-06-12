import express from 'express';

import {
  getAllAuthorizations,
  getAuthorizationById,
  createAuthorization,
  updateAuthorization,
  deleteAuthorization,
  getAllRoles,

} from '../../main-structure/MasterData/MasterDataController/MasterAutorizhation'; // Pastikan path-nya benar

import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,

} from '../../main-structure/MasterData/MasterDataController/MasterDepartment'; // Pastikan path-nya benar

import {
  createSectionDepartment,
  getAllSectionDepartments,
  getSectionDepartmentById,
  updateSectionDepartment,
  deleteSectionDepartment,

} from '../../main-structure/MasterData/MasterDataController/MasterSectionDepartment'; // Pastikan path-nya benar

import {
  createLine,
  getAllLines,
  getLineById,
  updateLine,
  deleteLine,

} from '../../main-structure/MasterData/MasterDataController/MasterLine'; // Pastikan path-nya benar

import {

  createArea,
  getAllAreas,
  getAreaById,
  updateArea,
  deleteArea,

} from '../../main-structure/MasterData/MasterDataController/MasterArea'; // Pastikan path-nya benar

import {
  getAllPlants,
  getPlantById,
} from '../../main-structure/MasterData/MasterDataController/MasterPlant'; // Pastikan path-nya benar


import {

  createDepartmentHead,
  getAllDepartmentHeads,
  getAllDepartmentHeadsbyID,
  updateDepartmentHead,
  softDeleteDepartmentHead,

} from '../../main-structure/MasterData/MasterDataController/MasterHeadDepartments'; // Pastikan path-nya benar


import {

  createSectionHead,
  getAllSectionHeads,
  getAllSectionHeadsbyID,
  updateSectionHead,
  softDeleteSectionHead,

} from '../../main-structure/MasterData/MasterDataController/MasterHeadSection'; // Pastikan path-nya benar


import {
    getAllTemplateApprovals,
    getTemplateApprovalById,
    createTemplateApproval,
    updateTemplateApproval,
    deleteTemplateApproval,
    bulkCreateTemplateApprovals,
    getTemplateApprovalsByTemplateName,
    getTemplateApprovalsByLineCode,
    toggleTemplateApprovalStatus
} from '../../main-structure/MasterData/MasterDataController/MasterApproverProposed';

const router = express.Router();

// Routes untuk Area (sesuaikan path-nya)
router.post("/userGodoc", createAuthorization);        // POST /userGodoc
router.get("/userGodoc", getAllAuthorizations);         // GET /userGodoc?page=1&limit=10&search=...&status=true
router.get("/userGodoc/:id", getAuthorizationById);    // GET /userGodoc/123
router.put("/userGodoc/:id", updateAuthorization);    // PUT /userGodoc/123
router.delete("/userGodoc/:id", deleteAuthorization);  // DELETE /areas/123  (Soft Delete)
router.get("/getAllRoles", getAllRoles);         // GET /userGodoc?page=1&limit=10&search=...&status=true

//getAllRoles

// Routes untuk Department (sesuaikan path-nya)
router.post("/departments", createDepartment);        // POST /departments
router.get("/departments", getAllDepartments);         // GET /departments?page=1&limit=10&search=...&status=true
router.get("/departments/:id", getDepartmentById);    // GET /departments/123
router.put("/departments/:id", updateDepartment);    // PUT /departments/123
router.delete("/departments/:id", deleteDepartment);  // DELETE /departments/123  (Soft Delete)

//Section Department
router.post("/sectiondepartments", createSectionDepartment);        // POST /sectiondepartments
router.get("/sectiondepartments", getAllSectionDepartments);         // GET /sectiondepartments?page=1&limit=10&search=...&status=true
router.get("/sectiondepartments/:id", getSectionDepartmentById);    // GET /sectiondepartments/123
router.put("/sectiondepartments/:id", updateSectionDepartment);    // PUT /sectiondepartments/123
router.delete("/sectiondepartments/:id", deleteSectionDepartment);  // DELETE /departments/123  (Soft Delete)

// Routes untuk Line (sesuaikan path-nya)
router.post("/lines", createLine);        // POST /lines
router.get("/lines", getAllLines);         // GET /lines?page=1&limit=10&search=...&status=true
router.get("/lines/:id", getLineById);    // GET /lines/123
router.put("/lines/:id", updateLine);    // PUT /lines/123
router.delete("/lines/:id", deleteLine);  // DELETE /lines/123  (Soft Delete)

// Routes untuk Area (sesuaikan path-nya)
router.post("/areas", createArea);        // POST /areas
router.get("/areas", getAllAreas);         // GET /areas?page=1&limit=10&search=...&status=true
router.get("/areas/:id", getAreaById);    // GET /areas/123
router.put("/areas/:id", updateArea);    // PUT /areas/123
router.delete("/areas/:id", deleteArea);  // DELETE /areas/123  (Soft Delete)


//getAllPlants
router.get("/plants", getAllPlants);         // GET /departments?page=1&limit=10&search=...&status=true
router.get("/plants/:id", getPlantById);


// Routes untuk Area (sesuaikan path-nya)
router.post("/headDepartments", createDepartmentHead);        // POST /headDepartments
router.get("/headDepartments", getAllDepartmentHeads);         // GET /headDepartments?page=1&limit=10&search=...&status=true
router.get("/headDepartments/:id", getAllDepartmentHeadsbyID);    // GET /headDepartments/123
router.put("/headDepartments/:id", updateDepartmentHead);    // PUT /headDepartments/123
router.delete("/headDepartments/:id", softDeleteDepartmentHead);  // DELETE /headDepartments/123  (Soft Delete)

// // Routes untuk Area (sesuaikan path-nya)
router.post("/headSection", createSectionHead);        // POST /headSection
router.get("/headSection", getAllSectionHeads);         // GET /headSection?page=1&limit=10&search=...&status=true
router.get("/headSection/:id", getAllSectionHeadsbyID);    // GET /headSection/123
router.put("/headSection/:id", updateSectionHead);    // PUT /headSection/123
router.delete("/headSection/:id", softDeleteSectionHead);  // DELETE /areas/123  (Soft Delete)

// ==========================
// 📋 Template Approval CRUD Operations
// ==========================

// GET All template approvals with pagination, search, and filters
// Query parameters:
// - page: number (default: 1)
// - limit: number (default: 10)
// - search: string (searches in template_name, line_code, actor_name, model_type, description, created_by)
// - is_active: boolean (true/false)
// - line_code: string (filter by line code)
// - model_type: string (filter by model type)
// - sort: string (id, template_name, line_code, step_order, actor_name, model_type, priority, created_date, updated_date)
// - direction: asc/desc (default: asc)
// Example: /api/template-approvals?page=1&limit=10&search=template&is_active=true&sort=step_order&direction=asc
router.get('/approverproposed', getAllTemplateApprovals);

// GET Template approval by ID
// Example: /api/template-approvals/1
router.get('/approverproposed/:id', getTemplateApprovalById);

// POST Create new template approval
// Body: TemplateApprovalData object
// Required fields: template_name, step_order, actor_name, model_type, created_by
router.post('/approverproposed', createTemplateApproval);

// PUT Update template approval by ID
// Body: TemplateApprovalData object
// Required fields: template_name, step_order, actor_name, model_type, created_by, updated_by
router.put('/approverproposed/:id', updateTemplateApproval);

// DELETE Soft delete template approval by ID
// Body: { deleted_by: string } (optional)
router.delete('/approverproposed/:id', deleteTemplateApproval);

// ==========================
// 📊 Bulk Operations
// ==========================

// POST Bulk create template approvals
// Body: { data: TemplateApprovalData[] }
// Returns success/failure count with detailed results
router.post('/bulk/create', bulkCreateTemplateApprovals);

// ==========================
// 🔍 Specialized Queries
// ==========================

// GET Template approvals by template name (ordered by step_order)
// Returns active templates only, ordered by step_order ASC
// Example: /api/template-approvals/template/MyTemplate
router.get('/template/:template_name', getTemplateApprovalsByTemplateName);

// GET Template approvals by line code (ordered by template_name, step_order)
// Returns active templates only
// Example: /api/template-approvals/line/LINE001
router.get('/line/:line_code', getTemplateApprovalsByLineCode);

// ==========================
// Status Management
// ==========================

// PATCH Toggle active/inactive status
// Body: { updated_by: string } (optional)
router.patch('/approverproposed/:id/toggle-status', toggleTemplateApprovalStatus);


export default router;