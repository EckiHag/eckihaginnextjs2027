"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Database, Home, Languages, List, Printer, Search, Users, CalendarDays } from "lucide-react";
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
// const vocabularyNavigation = [
//   {
//     title: "Anzeigen",
//     href: "/vokabeln",
//     icon: List,
//   },
//   {
//     title: "Suchen",
//     href: "/vokabeln/suchen",
//     icon: Search,
//   },
//   {
//     title: "Drucken",
//     href: "/vokabeln/drucken",
//     icon: Printer,
//   },
// ];
const spielenNavigation = [
  {
    title: "Pacman",
    href: "/spielen/pacman",
    icon: List,
  },
  {
    title: "Vier gewinnt",
    href: "/spielen/viergewinnt",
    icon: Search,
  },
  {
    title: "Memory",
    href: "/spielen/memory",
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
  // const vocabularyIsActive = pathname.startsWith("/vokabeln");
  // const [vocabularyOpen, setVocabularyOpen] = useState(vocabularyIsActive);

  const spielenIsActive = pathname.startsWith("/spielen");
  const [spielenOpen, setSpielenOpen] = useState(spielenIsActive);

  function handleTouchStart(event: React.TouchEvent) {
    const x = event.touches[0].clientX;

    if (x <= 30) {
      touchStartX.current = x;
    } else {
      touchStartX.current = null;
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (touchStartX.current === null) {
      return;
    }

    const currentX = event.touches[0].clientX;
    const distance = currentX - touchStartX.current;

    if (distance > 50 && isMobile) {
      setOpenMobile(true);
      touchStartX.current = null;
    }
  }

  function handleTouchEnd() {
    touchStartX.current = null;
  }

  function closeMobileSidebar() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }
  return (
    <>
      {isMobile && <div className="fixed inset-y-0 left-0 z-40 w-6" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} />}

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
          </SidebarMenu>
          {userRole === "ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel>Datenbank haggipapi</SidebarGroupLabel>

              <SidebarGroupContent>
                {/* ---Vokabeln--- */}
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/vokabeln" onClick={closeMobileSidebar} />}
                      tooltip="Vokabeln"
                      isActive={pathname === "/vokabeln"}
                      className={pathname === "/vokabeln" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                    >
                      <Languages />
                      <span>Vokabeln</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* ---Daten--- */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/daten" onClick={closeMobileSidebar} />}
                      tooltip="Daten"
                      isActive={pathname === "/daten"}
                      className={pathname === "/daten" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                    >
                      <Users />
                      <span>Daten</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* ---Kalender--- */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/kalender" onClick={closeMobileSidebar} />}
                      tooltip="Daten"
                      isActive={pathname === "/kalender"}
                      className={pathname === "/kalender" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                    >
                      <CalendarDays className="h-5 w-5" />
                      <span>Kalender</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
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

          <SidebarGroup>
            <SidebarGroupLabel>Spielen</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    type="button"
                    tooltip="Spielen"
                    isActive={spielenIsActive}
                    onClick={() => setSpielenOpen((open) => !open)}
                    className={spielenIsActive ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                  >
                    <span>Eigene</span>

                    <ChevronDown className={`ml-auto transition-transform ${spielenOpen ? "rotate-180" : ""}`} />
                  </SidebarMenuButton>

                  {spielenOpen && (
                    <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
                      {spielenNavigation.map((item) => (
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
                    render={<Link href="/hangman" onClick={closeMobileSidebar} />}
                    tooltip="hangman"
                    isActive={pathname === "/hangman"}
                    className={pathname === "/hangman" ? "bg-amber-100 font-semibold text-amber-900 hover:bg-amber-200" : "hover:bg-muted"}
                  >
                    <Users />
                    <span>Hangman</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
