import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const database = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = database;


export * from "@prisma/client";
// import { PrismaClient } from "@prisma/client"

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
// export const database = globalForPrisma.prisma || new PrismaClient()
 
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = database
