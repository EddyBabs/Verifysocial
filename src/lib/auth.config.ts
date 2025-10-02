import bcrypt from "bcryptjs";
import { AuthError, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
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
    InstagramProvider({
      authorization:
        "https://www.instagram.com/oauth/authorize?scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish",
      clientId: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      async profile(profile) {
        console.log("Instagram");
        console.log({ profile });
        return profile;
      },
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        console.dir({ profile }, { depth: null });
        return {
          id: profile.sub,
          email: profile.email,
          fullname: profile.name,
          image: profile?.picture?.data?.url || "",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,

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
