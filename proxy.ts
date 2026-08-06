export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/vokabeln/:path*", "/datenbanktest/:path*", "/personen/:path*", "/api/vokabeln/:path*"],
};
