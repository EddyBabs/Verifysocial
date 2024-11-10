import bcrypt from "bcryptjs";
import { AuthError, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { signInSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/user";
// import { sendVerification } from "@/actions/send-verification";

class InvalidLoginError extends AuthError {
  static type = "CredentialsSignin";
}

class UnverifiedUserError extends AuthError {
  static type = "Verification";
}

export default {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENTD_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      async profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          fullname: `${profile.given_name || ""} ${
            profile.family_name || ""
          }`.trim(),
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) throw new InvalidLoginError();
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!user.emailVerified) {
            throw new UnverifiedUserError();
          }
          if (passwordsMatch) return { ...user };
        }
        throw new InvalidLoginError();
      },
    }),
  ],
} satisfies NextAuthConfig;
