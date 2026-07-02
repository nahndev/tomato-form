"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden">
      <div className="grid justify-center items-center size-full">
        <div className="flex flex-row items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
