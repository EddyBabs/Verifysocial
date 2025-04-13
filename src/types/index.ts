import { Prisma } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type RoleType = "user" | "vendor";

export type FeaturePrisma = Prisma.ReviewGetPayload<{
  include: { user: { select: { fullname: true } } };
}>;

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "ADMIN" | "VENDOR";
  fullname: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
