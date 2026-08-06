import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function TestPage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">EckiHack</h1>
        </header>

        <main className="p-6">
          <h2 className="text-2xl font-bold">Testseite</h2>

          <p className="mt-4">Wenn du diese Seite siehst, funktioniert die Sidebar.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
