import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
    errorFormat: "minimal",
    datasources: {
      db: {
        url: "postgresql://postgres:anny@localhost:5432/equipmentmsdb?schema=public",
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
