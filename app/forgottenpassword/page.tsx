"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "./actions";

export default function ForgottenPasswordPage() {
  const [message, formAction, pending] = useActionState(requestPasswordReset, "");

  return (
    <section className="flex w-full justify-center py-8 sm:py-16">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl
                   border border-border bg-card text-card-foreground
                   shadow-sm"
      >
        <div className="h-2 bg-amber-500" />

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Passwort vergessen?</h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Gib die E-Mail-Adresse deines Benutzerkontos ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts.
          </p>

          <form action={formAction} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                E-Mail-Adresse
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                className="block w-full rounded-lg border border-input
                           bg-background px-3 py-3 text-base
                           text-foreground outline-none
                           focus-visible:border-amber-600
                           focus-visible:ring-2
                           focus-visible:ring-amber-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="min-h-12 w-full cursor-pointer rounded-lg
                         bg-amber-900 px-4 py-3 font-semibold text-white
                         transition-colors hover:bg-amber-800
                         focus-visible:outline-2
                         focus-visible:outline-offset-4
                         focus-visible:outline-amber-600
                         disabled:cursor-wait disabled:opacity-50
                         dark:bg-amber-300 dark:text-amber-950
                         dark:hover:bg-amber-200"
            >
              {pending ? "Anfrage wird bearbeitet …" : "Link anfordern"}
            </button>

            {message && (
              <p
                role="status"
                className="rounded-lg border border-border
                           bg-muted/40 p-4 text-sm leading-6"
              >
                {message}
              </p>
            )}
          </form>

          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium
                       underline underline-offset-4"
          >
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </section>
  );
}
