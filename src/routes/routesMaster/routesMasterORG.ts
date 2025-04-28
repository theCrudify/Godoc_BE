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


export default router;