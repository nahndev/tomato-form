"use client";

import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import simplify from "simplify-js";
import { CanvasStage, type CanvasStroke } from "./CanvasStage";

const SIMPLIFY_TOLERANCE = 1;

function simplifyPoints(flat: number[]): number[] {
  const points = [];
  for (let i = 0; i < flat.length; i += 2) {
    points.push({ x: flat[i], y: flat[i + 1] });
  }
  return simplify(points, SIMPLIFY_TOLERANCE, true).flatMap((p) => [p.x, p.y]);
}

export interface CanvasRef {
  insertImage: (file: File) => void;
  clear: () => void;
}

interface CanvasProps {
  value?: string;
  onChange?: (dataUrl: string) => void;
  className?: string;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas(
  { value, onChange, className },
  ref,
) {
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawingRef = useRef(false);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const [strokes, setStrokes] = useState<CanvasStroke[]>([]);

  useEffect(() => {
    if (!value) return;
    const img = new Image();
    img.onload = () => setBackgroundImage(img);
    img.src = value;
  }, [value]);

  function exportStage() {
    const stage = stageRef.current;
    if (stage) onChange?.(stage.toDataURL({ mimeType: "image/png" }));
  }

  function handlePointerDown(e: KonvaEventObject<PointerEvent>) {
    isDrawingRef.current = true;
    const point = e.target.getStage()?.getPointerPosition();
    if (!point) return;
    setStrokes((prev) => [...prev, { points: [point.x, point.y] }]);
  }

  function handlePointerMove(e: KonvaEventObject<PointerEvent>) {
    if (!isDrawingRef.current) return;
    const point = e.target.getStage()?.getPointerPosition();
    if (!point) return;
    setStrokes((prev) => {
      const lastStroke = prev[prev.length - 1];
      if (!lastStroke) return prev;
      const updatedStroke: CanvasStroke = {
        points: [...lastStroke.points, point.x, point.y],
      };
      return [...prev.slice(0, -1), updatedStroke];
    });
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setStrokes((prev) => {
      const lastStroke = prev[prev.length - 1];
      if (!lastStroke) return prev;
      const simplified: CanvasStroke = {
        points: simplifyPoints(lastStroke.points),
      };
      return [...prev.slice(0, -1), simplified];
    });
    exportStage();
  }

  useEffect(() => {
    if (!backgroundImage) return;
    exportStage();
  }, [backgroundImage]);

  useImperativeHandle(ref, () => ({
    insertImage(file: File) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
          setStrokes([]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    clear() {
      setBackgroundImage(null);
      setStrokes([]);
      onChange?.("");
    },
  }));

  return (
    <div
      className={
        className ??
        "h-full w-full touch-none overflow-hidden rounded-md border border-input bg-white"
      }
    >
      <CanvasStage
        ref={stageRef}
        backgroundImage={backgroundImage}
        strokes={strokes}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
});
