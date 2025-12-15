// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const database = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prisma = database;

// export * from "@prisma/client";

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

declare global {
  var prismaInstance: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaInstance ?? prismaClientSingleton();

export { prisma as database };

if (process.env.NODE_ENV !== "production") globalThis.prismaInstance = prisma;

export * from "@prisma/client";
