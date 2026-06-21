"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div>
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
