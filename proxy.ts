export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/vokabeln/:path*", "/datenbanktest/:path*", "/daten/:path*", "/api/vokabeln/:path*"],
};
