import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { approveUser, setUserToNewbie, setUserActive, changeUserRole } from "./actions";

export default async function BenutzerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  const users = await prisma.userEckiHack.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
    orderBy: {
      username: "asc",
    },
  });

  const actionButtonClass =
    "inline-flex min-h-9 cursor-pointer items-center justify-center " +
    "whitespace-nowrap rounded-md border px-3 py-1.5 text-xs " +
    "font-medium transition-colors focus-visible:outline-2 " +
    "focus-visible:outline-offset-2";

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">Verwaltung</p>

        <h1 className="mt-1 text-3xl font-bold">Benutzerverwaltung</h1>

        <p className="mt-2 text-sm text-muted-foreground">{users.length} Benutzerkonten</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {users.map((user) => (
          <article
            key={user.id}
            className="min-w-0 rounded-xl border bg-card
                       p-5 text-card-foreground shadow-sm"
          >
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="wrap-anywhere text-xl font-semibold">{user.username}</h2>

                <p className="mt-1 wrap-anywhere text-sm text-muted-foreground">{user.name || "Kein Name angegeben"}</p>
              </div>

              <span
                className={
                  user.active
                    ? "inline-flex shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900 dark:bg-green-950 dark:text-green-200"
                    : "inline-flex shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-900 dark:bg-red-950 dark:text-red-200"
                }
              >
                {user.active ? "Aktiv" : "Gesperrt"}
              </span>
            </header>

            <dl className="mt-5 space-y-4 border-t pt-4">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">E-Mail-Adresse</dt>

                <dd className="mt-1 wrap-anywhere text-sm">{user.email || "Keine E-Mail hinterlegt"}</dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-muted-foreground">Rolle</dt>

                <dd className="mt-1">
                  <span className="inline-flex rounded-md border px-2 py-1 text-xs font-medium">{user.role}</span>
                </dd>
              </div>
            </dl>

            {user.role !== "ADMIN" && (
              <div className="mt-4 border-t pt-3">
                {user.active && user.role === "NEWBIE" && <p className="mb-3 text-xs text-muted-foreground">Wartet auf Freischaltung.</p>}

                <div className="flex flex-wrap items-center gap-2">
                  <form key={user.role} action={changeUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={user.id} />

                    <label htmlFor={`role-${user.id}`} className="sr-only">
                      Rolle für {user.username}
                    </label>

                    <select
                      id={`role-${user.id}`}
                      name="role"
                      defaultValue={user.role}
                      className="min-h-9 rounded-md border border-input
               bg-background px-2 py-1.5 text-xs
               text-foreground
               focus-visible:outline-2
               focus-visible:outline-offset-2
               focus-visible:outline-amber-600"
                    >
                      <option value="NEWBIE">NEWBIE</option>
                      <option value="USER">USER</option>
                      <option value="EDITOR">EDITOR</option>
                    </select>

                    <button
                      type="submit"
                      className={`${actionButtonClass}
                border-border bg-muted text-foreground
                hover:bg-muted/70
                focus-visible:outline-amber-600`}
                    >
                      Übernehmen
                    </button>
                  </form>
                  {user.active && user.role === "NEWBIE" && (
                    <form action={approveUser}>
                      <input type="hidden" name="userId" value={user.id} />

                      <button
                        type="submit"
                        className={`${actionButtonClass}
                          border-amber-900 bg-amber-900 text-white
                          hover:bg-amber-800
                          focus-visible:outline-amber-600
                          dark:border-amber-300 dark:bg-amber-300
                          dark:text-amber-950 dark:hover:bg-amber-200`}
                      >
                        Freischalten
                      </button>
                    </form>
                  )}

                  {user.role === "USER" && (
                    <form action={setUserToNewbie}>
                      <input type="hidden" name="userId" value={user.id} />

                      <button
                        type="submit"
                        title="Freigabe zurücknehmen und Rolle auf NEWBIE setzen"
                        className={`${actionButtonClass}
                          border-amber-600 text-amber-900
                          hover:bg-amber-50
                          focus-visible:outline-amber-600
                          dark:text-amber-300 dark:hover:bg-amber-950`}
                      >
                        Auf NEWBIE
                      </button>
                    </form>
                  )}

                  <form action={setUserActive}>
                    <input type="hidden" name="userId" value={user.id} />

                    <input type="hidden" name="active" value={user.active ? "false" : "true"} />

                    <button
                      type="submit"
                      className={`${actionButtonClass} ${
                        user.active
                          ? "border-red-600 text-red-800 hover:bg-red-50 focus-visible:outline-red-600 dark:text-red-300 dark:hover:bg-red-950"
                          : "border-green-600 text-green-800 hover:bg-green-50 focus-visible:outline-green-600 dark:text-green-300 dark:hover:bg-green-950"
                      }`}
                    >
                      {user.active ? "Sperren" : "Entsperren"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {String(user.id) === session.user.id && <p className="mt-4 text-xs font-medium text-muted-foreground">Dein eigenes Konto</p>}
          </article>
        ))}
      </div>

      {users.length === 0 && <p className="rounded-xl border p-6 text-center text-muted-foreground">Keine Benutzerkonten vorhanden.</p>}
    </section>
  );
}
