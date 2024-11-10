import { PrismaAdapter } from "@auth/prisma-adapter";
import { database, UserRole } from "@/lib/database";
import NextAuth, { AuthError } from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "@/data/user";
// import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  events: {
    async linkAccount({ user }) {
      await database.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      const existingUser = await getUserById(user.id || "");

      if (account?.provider !== "credentials") return true;
      if (existingUser?.anonymous) {
        await database.user.update({
          where: { id: existingUser.id },
          data: { anonymous: false },
        });
      }
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = "user";
      return token;
    },
  },
  adapter: PrismaAdapter(database),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  ...authConfig,
});
