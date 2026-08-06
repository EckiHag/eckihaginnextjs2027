import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DatenbanktestPage() {
  const vocs = await prisma.vocs.findMany({
    take: 10,
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Datenbanktest</h1>

      <p>Es wurden {vocs.length} Datensätze geladen.</p>

      <pre
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f2f2f2",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(vocs, null, 2)}
      </pre>
    </main>
  );
}
