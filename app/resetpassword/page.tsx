import Link from "next/link";

import { ResetPasswordForm } from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const validFormat = /^[a-f0-9]{64}$/.test(token);

  return (
    <section className="flex w-full justify-center py-8 sm:py-16">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl
                   border border-border bg-card text-card-foreground
                   shadow-sm"
      >
        <div className="h-2 bg-amber-500" />

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Neues Passwort</h1>

          {validFormat ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">Der Passwort-Link fehlt oder ist ungültig. Bitte fordere einen neuen Link an.</p>

              <Link href="/forgottenpassword" className="inline-block font-medium underline">
                Neuen Link anfordern
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
