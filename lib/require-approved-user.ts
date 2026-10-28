import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";
import { redirect } from "next/navigation";

export async function requireApprovedUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/freischaltung");
  }

  return session.user;
}
