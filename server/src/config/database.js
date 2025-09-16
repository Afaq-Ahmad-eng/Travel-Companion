import { PrismaClient } from "@prisma/client";

// Create a single PrismaClient instance
let prisma;

if (!prisma) {
  prisma = new PrismaClient();

  // Connect to the database
  prisma
    .$connect()
    .then(() => console.log("✅ Prisma Client connected to MySQL"))
    .catch((err) => {
      console.error("Prisma connection error:", err);
      process.exit(1);
    });
}

export default prisma;
