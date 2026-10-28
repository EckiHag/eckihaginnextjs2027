"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resetPassword } from "./actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, {
    success: false,
    message: "",
  });

  if (state.success) {
    return (
      <div className="mt-6 space-y-6">
        <p role="status" className="text-sm leading-6">
          {state.message}
        </p>

        <Link
          href="/login"
          className="inline-flex min-h-12 w-full items-center
                     justify-center rounded-lg bg-amber-900 px-4
                     font-semibold text-white hover:bg-amber-800
                     dark:bg-amber-300 dark:text-amber-950"
        >
          Zur Anmeldung
        </Link>
      </div>
    );
  }

  const inputClass =
    "block w-full rounded-lg border border-input bg-background " +
    "px-3 py-3 text-base text-foreground outline-none " +
    "focus-visible:border-amber-600 focus-visible:ring-2 " +
    "focus-visible:ring-amber-500/30";

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Neues Passwort
        </label>

        <input id="password" name="password" type="password" autoComplete="new-password" minLength={12} required aria-describedby="password-hint" className={inputClass} />

        <p id="password-hint" className="text-sm text-muted-foreground">
          Mindestens 12 Zeichen.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmation" className="block text-sm font-medium">
          Passwort wiederholen
        </label>

        <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={12} required className={inputClass} />
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full cursor-pointer rounded-lg
                   bg-amber-900 px-4 py-3 font-semibold text-white
                   hover:bg-amber-800
                   focus-visible:outline-2
                   focus-visible:outline-offset-4
                   focus-visible:outline-amber-600
                   disabled:cursor-wait disabled:opacity-50
                   dark:bg-amber-300 dark:text-amber-950
                   dark:hover:bg-amber-200"
      >
        {pending ? "Wird gespeichert …" : "Neues Passwort speichern"}
      </button>

      <Link href="/forgottenpassword" className="inline-block text-sm underline underline-offset-4">
        Neuen Passwort-Link anfordern
      </Link>
    </form>
  );
}
