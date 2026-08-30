// app/vokabeln/loading.tsx

import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-75 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Records werden geladen …</span>
      </div>
    </div>
  );
}
