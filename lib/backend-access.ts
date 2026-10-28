import type { UserRole } from "@/app/generated/prisma/client";

export function visibleLanguageFilter(role: UserRole | undefined): { sprache?: { not: string } } {
  return role === "ADMIN" ? {} : { sprache: { not: "BackendMitWebsite" } };
}

export function isBackendLanguage(value: unknown): boolean {
  return (
    String(value ?? "")
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .trim()
      .toLowerCase() === "backendmitwebsite"
  );
}
