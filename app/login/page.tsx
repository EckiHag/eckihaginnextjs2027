import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { signIn } from "@/auth";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      redirect("/login?error=missing");
    }

    try {
      await signIn("credentials", {
        username,
        password,
        redirectTo: "/vokabeln",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=credentials");
      }

      throw error;
    }
  }

  return (
    <section aria-labelledby="login-title" className="flex w-full justify-center py-8 sm:py-16">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl
                   border border-border bg-card text-card-foreground
                   shadow-sm"
      >
        <div className="h-2 bg-amber-500" />

        <div className="p-6 sm:p-8">
          <header className="mb-8">
            <p
              className="mb-2 text-xs font-semibold uppercase
                         tracking-widest text-amber-800
                         dark:text-amber-300"
            >
              EckiHack
            </p>

            <h1 id="login-title" className="text-3xl font-bold tracking-tight">
              Anmelden
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">Melde dich mit deinem Benutzernamen und Passwort an.</p>
          </header>

          <form action={login} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Benutzername
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                className="block w-full rounded-lg border border-input
                           bg-background px-3 py-3 text-base
                           text-foreground outline-none transition
                           focus-visible:border-amber-600
                           focus-visible:ring-2
                           focus-visible:ring-amber-500/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Passwort
              </label>

              <PasswordInput />

              <div className="pt-1 text-right">
                <Link
                  href="/forgottenpassword"
                  className="rounded-sm text-sm text-muted-foreground
                             underline underline-offset-4
                             hover:text-foreground
                             focus-visible:outline-2
                             focus-visible:outline-offset-4"
                >
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex min-h-12 w-full cursor-pointer
                         items-center justify-center rounded-lg
                         bg-amber-900 px-4 py-3 text-base font-semibold
                         text-white shadow-sm transition-colors
                         hover:bg-amber-800
                         focus-visible:outline-2
                         focus-visible:outline-offset-4
                         focus-visible:outline-amber-600
                         dark:bg-amber-300 dark:text-amber-950
                         dark:hover:bg-amber-200"
            >
              Anmelden
            </button>
          </form>
        </div>

        <footer
          className="border-t border-border bg-muted/40
                     px-6 py-5 text-center sm:px-8"
        >
          <p className="text-sm text-muted-foreground">Du hast noch kein Konto?</p>

          <Link
            href="/register"
            className="mt-3 inline-flex min-h-11 items-center
                       justify-center rounded-lg border border-border
                       bg-background px-5 py-2 text-sm font-semibold
                       text-foreground transition-colors
                       hover:bg-muted
                       focus-visible:outline-2
                       focus-visible:outline-offset-4
                       focus-visible:outline-amber-600"
          >
            Jetzt registrieren
          </Link>
        </footer>
      </div>
    </section>
  );
}
