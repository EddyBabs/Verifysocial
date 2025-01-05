import NextAuth, { DefaultSession } from "next-auth";

export type RoleType = "user" | "vendor";

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "ADMIN" | "VENDOR";
  fullname: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
