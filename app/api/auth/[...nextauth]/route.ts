import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/helpers/server.helper";
import prisma from "@/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectToDatabase();
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (!user?.hashedPassword) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
