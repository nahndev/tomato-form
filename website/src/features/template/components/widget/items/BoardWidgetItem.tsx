"use client";

import { Canvas, type CanvasRef } from "@/components/canvas";
import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/types/widget";
import { useRef } from "react";

export function BoardWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string>) {
  const canvasRef = useRef<CanvasRef>(null);

  function handleSelectImage(file: File | undefined) {
    if (!file) return;
    canvasRef.current?.insertImage(file);
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="h-64 w-full">
        <Canvas ref={canvasRef} value={value} onChange={onChange} />
      </div>
      <div className="flex items-center gap-3">
        <input
          id={widget.id}
          type="file"
          accept="image/*"
          onChange={(e) => handleSelectImage(e.target.files?.[0])}
          className="block flex-1 text-sm text-muted-foreground"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => canvasRef.current?.clear()}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
