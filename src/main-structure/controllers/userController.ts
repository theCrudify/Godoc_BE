import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../config/database";
import { verifyToken } from "../../middleware/authMiddleware"; // Import middleware JWT

// Fungsi untuk mendapatkan semua pengguna
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyToken(req, res, async () => { // Gunakan middleware JWT sebelum eksekusi endpoint
            const users = await prisma.mst_user.findMany({
                where: { is_deleted: false }, // Hanya ambil user yang belum dihapus
                select: { user_id: true, username: true, email: true, created_at: true }, // Pilih data yang perlu dikirim
            });

            if (users.length === 0) {
                res.status(404).json({ error: "No users found" });
                return;
            }

            res.json(users);
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//User by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyToken(req, res, async () => { // Gunakan middleware JWT sebelum eksekusi endpoint
            const user = await prisma.mst_user.findFirst({
                where: { 
                    user_id: Number(req.params.id), 
                    is_deleted: false // Hanya ambil user yang belum dihapus
                }
            });

            if (!user) {
                res.status(404).json({ error: "User not found or has been deleted" });
                return;
            }

            res.json(user);
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fungsi untuk membuat pengguna baru
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, full_name, phone_number, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8); // Gunakan hashSync agar lebih cepat

        // Cek apakah username, email, atau phone_number sudah ada
        const existingUser = await prisma.mst_user.findFirst({
            where: {
                OR: [{ username }, { email }, { phone_number }],
            },
            select: { username: true, email: true, phone_number: true }, // Ambil hanya yang dibutuhkan
        });

        // Validasi spesifik untuk setiap field
        if (existingUser) {
            if (existingUser.username === username) {
                res.status(400).json({ error: "Username already exists" });
                return;
            }
            if (existingUser.email === email) {
                res.status(400).json({ error: "Email already exists" });
                return;
            }
            if (existingUser.phone_number === phone_number) {
                res.status(400).json({ error: "Phone number already exists" });
                return;
            }
        }

        // Jika tidak ada duplikat, buat user baru
        const newUser = await prisma.mst_user.create({
            data: { username, full_name, phone_number, email, password: hashedPassword },
            select: { user_id: true, username: true, full_name: true, phone_number: true, email: true, created_at: true },
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyToken(req, res, async () => { // Gunakan middleware JWT sebelum eksekusi endpoint
            const userId = Number(req.params.id);
            const { username, email } = req.body;

            // Cek apakah user dengan ID tersebut ada
            const existingUser = await prisma.mst_user.findUnique({ where: { user_id: userId } });

            if (!existingUser) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Cek apakah username atau email sudah digunakan oleh user lain
            const userWithSameData = await prisma.mst_user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                    NOT: { user_id: userId }, // Pastikan bukan user yang sedang diupdate
                },
            });

            if (userWithSameData) {
                if (userWithSameData.username === username && userWithSameData.email === email) {
                    res.status(400).json({ error: "Username and email already exist" });
                    return;
                } else if (userWithSameData.username === username) {
                    res.status(400).json({ error: "Username already exists" });
                    return;
                } else if (userWithSameData.email === email) {
                    res.status(400).json({ error: "Email already exists" });
                    return;
                }
            }

            // Update user jika lolos validasi
            const updatedUser = await prisma.mst_user.update({
                where: { user_id: userId },
                data: { username, email },
            });

            res.json({ message: "User updated successfully", updatedUser });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fungsi untuk menghapus pengguna (Hard Delete)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyToken(req, res, async () => { // Gunakan middleware JWT sebelum eksekusi endpoint
            const userId = Number(req.params.id);

            // Cek apakah user dengan ID tersebut ada
            const existingUser = await prisma.mst_user.findUnique({ where: { user_id: userId } });

            if (!existingUser) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Hapus user jika ditemukan
            await prisma.mst_user.delete({ where: { user_id: userId } });

            res.json({ message: "User deleted successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Soft delete user (menandai is_deleted: true)
export const softDeleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyToken(req, res, async () => { // Gunakan middleware JWT sebelum eksekusi endpoint
            const userId = Number(req.params.id);

            // Langsung coba update user tanpa perlu dua query
            const updatedUser = await prisma.mst_user.updateMany({
                where: { user_id: userId, is_deleted: false },
                data: { is_deleted: true },
            });

            if (updatedUser.count === 0) {
                res.status(404).json({ error: "User not found or already deleted" });
                return;
            }

            res.json({ message: "User soft deleted successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
