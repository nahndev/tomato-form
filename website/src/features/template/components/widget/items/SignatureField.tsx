"use client";

import { useEffect, useRef } from "react";
import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 160;

/** Value is a PNG data URL produced by canvas.toDataURL(). */
export function SignatureField({ mode, value, onChange }: FieldComponentProps<string>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Redraw a previously saved signature when this widget mounts.
  useEffect(() => {
    if (mode !== "fill" || !value) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = value;
  }, [mode, value]);

  if (mode === "preview") {
    return (
      <div className="mt-2 flex h-24 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input bg-muted/30 text-muted-foreground">
        <PenTool className="size-4" />
        <span className="text-xs">Signature area</span>
      </div>
    );
  }

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!drawingRef.current || !canvas || !ctx || !lastPointRef.current) return;
    const point = getPoint(e);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange?.(canvas.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
    onChange?.("");
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="h-40 w-full touch-none rounded-md border border-input bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
}
