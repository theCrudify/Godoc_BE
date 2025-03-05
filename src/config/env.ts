import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is not defined in environment variables!");
}

export const generateToken = (userId: number): string => {
    const options: SignOptions = { expiresIn: "24h" }; // Format waktu yang benar

    return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, JWT_SECRET);
};
