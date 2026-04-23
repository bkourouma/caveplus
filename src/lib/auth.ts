import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";
import { z } from "zod";
import { authSecret } from "@/lib/auth-config";
import { authenticateCredentialsUser, ensureUserRecord } from "@/lib/server/auth";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        return authenticateCredentialsUser(parsed.data.email, parsed.data.password);
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const dbUser = await ensureUserRecord({
          email: user.email,
          name: user.name,
          image: user.image,
          role: ((user as { role?: Role }).role ?? Role.CUSTOMER)
        });

        user.id = dbUser.id;
        (user as { role?: string }).role = dbUser.role;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string | undefined) ?? "CUSTOMER";
      }

      return session;
    }
  }
};
