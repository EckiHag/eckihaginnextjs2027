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
      const pathname = request.nextUrl.pathname;

      const protectedRoutes = ["/vokabeln", "/datenbanktest", "/daten", "/designtestpage", "/api/vokabeln"];

      const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

      if (!isProtectedRoute) {
        return true;
      }

      const isApiRoute = pathname.startsWith("/api/");

      if (!auth?.user) {
        if (isApiRoute) {
          return Response.json({ error: "Bitte melde dich an." }, { status: 401 });
        }

        return false;
      }

      const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

      const isApproved = allowedRoles.includes(auth.user.role);

      if (!isApproved) {
        if (isApiRoute) {
          return Response.json({ error: "Dein Konto ist noch nicht freigeschaltet." }, { status: 403 });
        }

        return Response.redirect(new URL("/freischaltung", request.nextUrl));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionVersion = user.sessionVersion;
      }

      const userId = Number(token.id);

      if (!Number.isSafeInteger(userId) || userId <= 0 || typeof token.sessionVersion !== "number") {
        return null;
      }

      const currentUser = await prisma.userEckiHack.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          role: true,
          active: true,
          sessionVersion: true,
        },
      });

      if (!currentUser || !currentUser.active || token.sessionVersion !== currentUser.sessionVersion) {
        return null;
      }

      token.id = String(currentUser.id);
      token.role = currentUser.role;
      token.name = currentUser.name;

      return token;
    },

    async session({ session, token }) {
      /*
       * Die Daten aus dem JWT werden in session.user übernommen.
       */
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as UserRole) ?? UserRole.NEWBIE;
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
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
});
