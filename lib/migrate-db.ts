import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    console.log("Database migration completed successfully")
  } catch (e) {
    console.error("Error migrating database:", e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

