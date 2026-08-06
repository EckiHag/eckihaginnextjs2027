import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <form
        action={login}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "0.75rem",
        }}
      >
        <div>
          <h1>Anmelden</h1>
          <p>Bitte melde dich mit deinem Benutzernamen an.</p>
        </div>

        <div>
          <label htmlFor="username">Benutzername</label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.75rem",
              border: "1px solid #aaa",
              borderRadius: "0.4rem",
            }}
          />
        </div>

        <div>
          <label htmlFor="password">Passwort</label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: "0.25rem",
              padding: "0.75rem",
              border: "1px solid #aaa",
              borderRadius: "0.4rem",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            border: "none",
            borderRadius: "0.4rem",
            cursor: "pointer",
          }}
        >
          Anmelden
        </button>
      </form>
    </main>
  );
}
