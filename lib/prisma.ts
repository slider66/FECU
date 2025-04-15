import { PrismaClient } from "@prisma/client"

// Undgå flere instanser af Prisma Client i development
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
