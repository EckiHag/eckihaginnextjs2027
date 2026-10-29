"use server";

import { refresh } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/client";

export async function approveUser(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  const userId = Number(formData.get("userId"));

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Ungültige Benutzer-ID.");
  }

  await prisma.userEckiHack.updateMany({
    where: {
      id: userId,
      role: UserRole.NEWBIE,
      active: true,
    },
    data: {
      role: UserRole.USER,
    },
  });

  refresh();
}
export async function setUserToNewbie(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  const userId = Number(formData.get("userId"));

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Ungültige Benutzer-ID.");
  }

  await prisma.userEckiHack.updateMany({
    where: {
      id: userId,
      role: UserRole.USER,
    },
    data: {
      role: UserRole.NEWBIE,
    },
  });

  refresh();
}
export async function setUserActive(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  const userId = Number(formData.get("userId"));
  const activeValue = String(formData.get("active") ?? "");

  if (!Number.isSafeInteger(userId) || userId <= 0 || !["true", "false"].includes(activeValue)) {
    throw new Error("Ungültige Angaben.");
  }

  const nextActive = activeValue === "true";

  await prisma.userEckiHack.updateMany({
    where: {
      id: userId,
      role: {
        not: UserRole.ADMIN,
      },
      active: !nextActive,
    },
    data: {
      active: nextActive,
      sessionVersion: {
        increment: 1,
      },
    },
  });

  refresh();
}
