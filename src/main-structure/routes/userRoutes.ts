import express from 'express';
import * as userController from '../controllers/userController';
import * as loginAuthController from '../controllers/loginAuthController';
import { verifyToken } from "../../middleware/authMiddleware"; // Import middleware JWT
import { validateUserInput } from '../../middleware/validationMiddleware';
const router = express.Router();

// Routes untuk pengguna
router.get('/', verifyToken,userController.getUsers); // Ambil semua pengguna
router.get('/:id', userController.getUser); // Ambil satu pengguna berdasarkan ID
router.post('/', validateUserInput, userController.createUser); // Buat pengguna baru
router.put('/:id', validateUserInput, userController.updateUser); // Perbarui pengguna berdasarkan ID
router.delete('/:id', userController.deleteUser); // Hapus pengguna berdasarkan ID
router.delete('/soft/:id', userController.softDeleteUser); // Soft delete
router.post("/login", loginAuthController.loginUser); // Gunakan rate limiter di login

export default router;
