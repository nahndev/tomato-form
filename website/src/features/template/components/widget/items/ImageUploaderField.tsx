"use client";

import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

export interface UploadedImage {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

// No backend upload endpoint exists yet in this codebase (no S3/multer in
// server/src). The selected image is kept client-side as a base64 data URL
// for demo purposes only - a future task must add a real upload endpoint
// and switch this to upload-then-store-URL instead.
export function Field({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<UploadedImage | undefined>) {
  if (mode === "preview") {
    return (
      <div className="mt-2 flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-input bg-muted/30 text-muted-foreground">
        <ImageIcon className="size-4" />
        <span className="text-xs">No image</span>
      </div>
    );
  }

  function handleSelect(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange?.({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  if (value?.dataUrl) {
    return (
      <div className="mt-2 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value.dataUrl}
          alt={value.name}
          className="size-16 rounded-md border border-input object-cover"
        />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{value.name}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange?.(undefined)}
          >
            <X className="size-3.5" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <input
      id={widgetId}
      type="file"
      accept="image/*"
      onChange={(e) => handleSelect(e.target.files?.[0])}
      className="mt-2 block w-full text-sm text-muted-foreground"
    />
  );
}
