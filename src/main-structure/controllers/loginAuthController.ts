import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../config/database";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Gunakan Map sederhana agar lebih cepat
const loginAttempts = new Map<string, { count: number; timer?: NodeJS.Timeout }>();

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Ambil user langsung dari database (jangan cek loginAttempts dulu agar tidak memperlambat query)
        const user = await prisma.mst_user.findUnique({
            where: { email, is_deleted: false },
            select: { user_id: true, username: true, email: true, password: true }
        });

        if (!user) {
            handleFailedLogin(email);
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Cek apakah password cocok (gunakan async untuk menghindari blocking)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            handleFailedLogin(email);
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Reset login attempt jika berhasil login
        resetLoginAttempts(email);

        // Buat token JWT dengan masa berlaku 24 jam
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Kirim token sebagai HTTP-only cookie untuk keamanan tambahan (Opsional)
        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 jam
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fungsi menangani percobaan login gagal
const handleFailedLogin = (email: string) => {
    const attempt = loginAttempts.get(email) || { count: 0 };

    if (attempt.count >= 5) {
        return;
    }

    attempt.count += 1;
    loginAttempts.set(email, attempt);

    if (attempt.count === 1) {
        // Hanya set timer jika ini percobaan pertama
        attempt.timer = setTimeout(() => {
            loginAttempts.delete(email);
        }, 15 * 60 * 1000);
    }
};

// Fungsi mereset percobaan login setelah berhasil login
const resetLoginAttempts = (email: string) => {
    const attempt = loginAttempts.get(email);
    if (attempt?.timer) clearTimeout(attempt.timer);
    loginAttempts.delete(email);
};


//jidan was here