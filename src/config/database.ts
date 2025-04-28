import { PrismaClient as PrismaClientDB1 } from "../../prisma/generated/db1";
import { PrismaClient as PrismaClientDB2 } from "../../prisma/generated/db2";
import * as dotenv from "dotenv";

dotenv.config();

const prismaDB1 = new PrismaClientDB1({
  datasources: { db: { url: process.env.DATABASE_URL_1 } }
});

const prismaDB2 = new PrismaClientDB2({
  datasources: { db: { url: process.env.DATABASE_URL_2 } }
});

export { prismaDB1, prismaDB2 };
