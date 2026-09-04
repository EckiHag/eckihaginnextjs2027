"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NeueVokabelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sprache = searchParams.get("sprache") ?? "";
  const book = searchParams.get("book") ?? "";
  const chapter = searchParams.get("chapter") ?? "";

  const [form, setForm] = useState({
    ord: 0,
    art: "",
    artikel: "",
    wort: "",
    uebersetzung: "",
    beispielsatz: "",
    beispielsatzuebersetzung: "",
    eigenerKommentar: "",
    sprache,
    book,
    chapter,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "ord" ? Number(value) : value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/vokabeln/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error ?? "Datensatz konnte nicht gespeichert werden.");
      }

      await response.json();

      router.push("/vokabeln");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beim Speichern ist ein Fehler aufgetreten.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <h1 className="mb-6 text-2xl font-bold">Neuer Datensatz</h1>

        <div className="grid gap-4">
          <label>
            <span className="mb-1 block text-sm font-semibold">Reihenfolge</span>
            <input type="number" name="ord" value={form.ord} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Sprache</span>
            <input name="sprache" value={form.sprache} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Buch</span>
            <input name="book" value={form.book} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Kapitel</span>
            <input name="chapter" value={form.chapter} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Art</span>
            <input name="art" value={form.art} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Artikel</span>
            <input name="artikel" value={form.artikel} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Wort</span>
            <input name="wort" value={form.wort} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Speichern …" : "Speichern"}
            </button>

            <button type="button" onClick={() => router.back()} disabled={saving} className="rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted">
              Abbrechen
            </button>
          </div>
          <label>
            <span className="mb-1 block text-sm font-semibold">Übersetzung</span>
            <textarea name="uebersetzung" value={form.uebersetzung} onChange={handleChange} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Beispielsatz</span>
            <textarea name="beispielsatz" value={form.beispielsatz} onChange={handleChange} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Übersetzung Beispielsatz</span>
            <textarea
              name="beispielsatzuebersetzung"
              value={form.beispielsatzuebersetzung}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-semibold">Eigener Kommentar</span>
            <textarea
              name="eigenerKommentar"
              value={form.eigenerKommentar}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
        </div>

        {error && <div className="mt-4 rounded-lg border border-red-600 bg-red-50 p-3 text-red-800">{error}</div>}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Speichern …" : "Speichern"}
          </button>

          <button type="button" onClick={() => router.back()} disabled={saving} className="rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted">
            Abbrechen
          </button>
        </div>
      </div>
    </section>
  );
}
