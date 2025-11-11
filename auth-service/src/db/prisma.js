import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient();

prisma.$on("error", (e) => console.error("Prisma error", e))