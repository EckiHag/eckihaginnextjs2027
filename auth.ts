import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const pathname = request.nextUrl.pathname;

      const protectedRoutes = ["/vokabeln", "/datenbanktest", "/personen", "/designtestpage"];

      const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }

      return token;
    },

    async session({ session, token }) {
      /*
       * Die Daten aus dem JWT werden in session.user übernommen.
       */
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as UserRole) ?? UserRole.USER;
      }

      return session;
    },
  },

  providers: [
    Credentials({
      name: "Login",

      credentials: {
        username: {
          label: "Benutzername",
          type: "text",
        },
        password: {
          label: "Passwort",
          type: "password",
        },
      },

      async authorize(credentials) {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");

        if (!username || !password) {
          return null;
        }

        const user = await prisma.userEckiHack.findUnique({
          where: {
            username,
          },
        });

        if (!user || !user.active) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
