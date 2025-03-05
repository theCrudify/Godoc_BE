import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // Pastikan variabel .env dimuat

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // Gunakan langsung dari .env
        },
    },
});

export default prisma;
