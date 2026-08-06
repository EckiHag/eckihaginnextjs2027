import Link from "next/link";
import { LogIn } from "lucide-react";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";

export async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return <LogoutButton />;
  }

  return (
    <Button render={<Link href="/login" />} nativeButton={false} variant="outline" size="sm">
      <LogIn className="size-4" />
      <span>Anmelden</span>
    </Button>
  );
}
