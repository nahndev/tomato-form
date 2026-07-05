"use client";

import { Paperclip, X } from "lucide-react";
import type { FieldComponentProps } from "@/features/template/components/widget/types";
import { formatBytes } from "@/lib/format";

export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
}

// No backend upload endpoint exists yet in this codebase (no S3/multer in
// server/src). Only file metadata (name/size/type) is kept - no file
// content is persisted - for demo purposes only. A future task must add a
// real upload endpoint.
export function FileUploaderField({
  widgetId,
  mode,
  value,
  onChange,
}: FieldComponentProps<UploadedFileMeta[]>) {
  const files = value ?? [];

  if (mode === "preview") {
    return (
      <div className="mt-2 flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-input bg-muted/30 text-muted-foreground">
        <Paperclip className="size-4" />
        <span className="text-xs">No files attached</span>
      </div>
    );
  }

  function handleSelect(fileList: FileList | null) {
    if (!fileList) return;
    const next = [
      ...files,
      ...Array.from(fileList).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ];
    onChange?.(next);
  }

  function handleRemove(index: number) {
    onChange?.(files.filter((_, i) => i !== index));
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        id={widgetId}
        type="file"
        multiple
        onChange={(e) => handleSelect(e.target.files)}
        className="block w-full text-sm text-muted-foreground"
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border border-input px-2 py-1 text-xs"
            >
              <span className="truncate">
                {file.name} · {formatBytes(file.size)}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
