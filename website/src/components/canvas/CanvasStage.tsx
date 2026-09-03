"use client";

import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Line, Stage } from "react-konva";

export interface CanvasStroke {
  points: number[];
}

interface CanvasStageProps {
  backgroundImage: HTMLImageElement | null;
  strokes: CanvasStroke[];
  onPointerDown?: (e: KonvaEventObject<PointerEvent>) => void;
  onPointerMove?: (e: KonvaEventObject<PointerEvent>) => void;
  onPointerUp?: () => void;
}

// Presentational Konva canvas, shared by anything that needs to render
// strokes over an optional background image. Callers own the drawing state
// and pointer handlers; this component only renders it, filling whatever
// size its parent container gives it.
export const CanvasStage = forwardRef<Konva.Stage, CanvasStageProps>(
  function CanvasStage(
    { backgroundImage, strokes, onPointerDown, onPointerMove, onPointerUp },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(([entry]) => {
        if (!entry) return;
        const { width, height } = entry.contentRect;
        setSize({ width: width, height: height });
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={containerRef} className="h-full w-full">
        <Stage
          ref={ref}
          width={size.width}
          height={size.height}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <Layer>
            {backgroundImage && (
              <KonvaImage
                image={backgroundImage}
                width={size.width}
                height={size.height}
              />
            )}
            {strokes.map((stroke, index) => (
              <Line
                key={index}
                points={stroke.points}
                stroke="#0f172a"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
                bezier
                tension={0.3}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  },
);
