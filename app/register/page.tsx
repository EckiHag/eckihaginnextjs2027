"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setError("");
    setSuccess("");
    setPending(true);

    try {
      const result = await registerUser(data);

      if (result.status === "error") {
        setError(result.message);
      } else {
        setSuccess(result.message);
        form.reset();
      }
    } catch {
      setError("Die Verbindung ist fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10">
      <h1 className="text-3xl font-bold">Registrieren</h1>

      <p className="mt-2 text-muted-foreground">Erstelle dein Benutzerkonto für EckiHag.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Name (optional)</span>
          <input name="name" type="text" autoComplete="name" maxLength={150} placeholder="Vor- und Nachname" className="w-full rounded-md border bg-background px-3 py-2" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Benutzername</span>
          <input name="username" type="text" autoComplete="username" required className="w-full rounded-md border bg-background px-3 py-2" />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">E-Mail-Adresse</span>
          <input name="email" type="email" autoComplete="email" required className="w-full rounded-md border bg-background px-3 py-2" />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Passwort</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby="password-hint"
            className="w-full rounded-md border bg-background px-3 py-2"
          />
          <span id="password-hint" className="block text-sm text-muted-foreground">
            Mindestens 12 Zeichen.
          </span>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Passwort wiederholen</span>
          <input name="passwordConfirmation" type="password" autoComplete="new-password" required className="w-full rounded-md border bg-background px-3 py-2" />
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700 dark:text-green-400">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-primary px-4 py-2
             text-primary-foreground hover:opacity-90
             disabled:cursor-wait disabled:opacity-50"
        >
          {pending ? "Konto wird erstellt …" : "Konto erstellen"}
        </button>
      </form>

      <p className="mt-6 text-sm">
        Du hast bereits ein Konto?{" "}
        <Link href="/login" className="font-medium underline">
          Zur Anmeldung
        </Link>
      </p>
    </main>
  );
}
