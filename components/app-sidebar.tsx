"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Database, Home, Languages, List, Printer, Search, Users } from "lucide-react";
import { useRef, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PageTitle } from "@/components/page-title";
import type { UserRole } from "@/app/generated/prisma/client";

type AppSidebarProps = {
  userRole?: UserRole;
};
const vocabularyNavigation = [
  {
    title: "Anzeigen",
    href: "/vokabeln",
    icon: List,
  },
  {
    title: "Suchen",
    href: "/vokabeln/suchen",
    icon: Search,
  },
  {
    title: "Drucken",
    href: "/vokabeln/drucken",
    icon: Printer,
  },
];
const administrationNavigation = [
  {
    title: "DesignTestPage",
    href: "/designtestpage",
    icon: Database,
  },
  {
    title: "Datenbanktest",
    href: "/datenbanktest",
    icon: Database,
  },
];

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const touchStartX = useRef<number | null>(null);
  const vocabularyIsActive = pathname.startsWith("/vokabeln");

  const [vocabularyOpen, setVocabularyOpen] = useState(vocabularyIsActive);

  function handleTouchStart(event: React.TouchEvent) {
    const x = event.touches[0].clientX;

    if (x <= 30) {
      touchStartX.current = x;
    } else {
      touchStartX.current = null;
    }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0].clientX;
    const distance = endX - touchStartX.current;

    if (distance > 60 && isMobile) {
      setOpenMobile(true);
    }

    touchStartX.current = null;
  }
  function closeMobileSidebar() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }
  return (
    <>
      {isMobile && <div className="fixed inset-y-0 left-0 z-40 w-6" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />}

      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b">
          <Link href="/" className="flex h-10 items-center gap-2 px-0 font-semibold" onClick={closeMobileSidebar}>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-200 text-sm font-bold text-amber-950">EH</div>

            <div className="ml-4">
              <PageTitle />
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Allgemein</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/" onClick={closeMobileSidebar} />}
                    tooltip="Startseite"
                    isActive={pathname === "/"}
                    className={pathname === "/" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                  >
                    <Home />
                    <span>Startseite</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    type="button"
                    tooltip="Vokabeln"
                    isActive={vocabularyIsActive}
                    onClick={() => setVocabularyOpen((open) => !open)}
                    className={vocabularyIsActive ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                  >
                    <Languages />
                    <span>Vokabeln</span>

                    <ChevronDown className={`ml-auto transition-transform ${vocabularyOpen ? "rotate-180" : ""}`} />
                  </SidebarMenuButton>

                  {vocabularyOpen && (
                    <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
                      {vocabularyNavigation.map((item) => (
                        <li key={item.href}>
                          <SidebarMenuButton
                            render={<Link href={item.href} onClick={closeMobileSidebar} />}
                            tooltip={item.title}
                            isActive={pathname === item.href}
                            className={pathname === item.href ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/personen" onClick={closeMobileSidebar} />}
                    tooltip="Personen"
                    isActive={pathname === "/personen"}
                    className={pathname === "/personen" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                  >
                    <Users />
                    <span>Personen</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {userRole === "ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel>Verwaltung</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {administrationNavigation.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} onClick={closeMobileSidebar} />}
                        tooltip={item.title}
                        isActive={pathname === item.href}
                        className={pathname === item.href ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
}
