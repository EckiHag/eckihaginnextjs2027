"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput() {
  const [visible, setVisible] = useState(false);

  const label = visible ? "Passwort verbergen" : "Passwort anzeigen";

  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        autoCapitalize="none"
        spellCheck={false}
        required
        className="block w-full rounded-lg border border-input
                   bg-background py-3 pl-3 pr-12 text-base
                   text-foreground outline-none transition
                   focus-visible:border-amber-600
                   focus-visible:ring-2
                   focus-visible:ring-amber-500/30"
      />

      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={label}
        aria-controls="password"
        title={label}
        className="absolute inset-y-0 right-0 flex w-12
                   cursor-pointer items-center justify-center
                   rounded-r-lg text-muted-foreground
                   hover:text-foreground
                   focus-visible:outline-2
                   focus-visible:outline-offset-2
                   focus-visible:outline-amber-600"
      >
        {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
