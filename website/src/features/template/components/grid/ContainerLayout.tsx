import ItemLayout from "@/features/template/components/grid/ItemLayout";
import {
  COLUMN_WIDTH,
  GRID_COLUMNS,
} from "@/features/template/libs/grid-layout/constants";
import {
  AbsoluteLayoutUtils,
  getColumn,
  getMaxHeight,
  LayoutRect,
  setMaxHeight,
} from "@/features/template/libs/grid-layout/utils";
import { GridLayout } from "@/types/template";
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { generateKeyBetween } from "fractional-indexing";
import { useMemo, useState } from "react";
import { useMap } from "usehooks-ts";

export interface MovingLayout extends LayoutRect {
  id: string;
}

export interface ContainerLayoutProps {
  id: string;
  layouts: Record<string, GridLayout>;
  children: (id: string) => React.ReactNode;
  onMoving: (id: string, column: number, idx: string) => void;
  disabled?: boolean;
}

export function ContainerLayout({
  id,
  children,
  layouts,
  onMoving,
  disabled,
}: ContainerLayoutProps) {
  const [heightMap, { set: setHeight }] = useMap<string, number>();
  const { ref, isDropTarget } = useDroppable({ id });
  const [moving, setMoving] = useState<MovingLayout | null>(null);

  // Lay widgets out top-to-bottom by idx, then make room for the widget
  // currently being dragged ("moving") by reserving its height at the slot
  // where it would land, pushing later widgets down.
  const computedLayouts = useMemo(() => {
    const absoluteLayouts = Object.entries(layouts)
      .map(([widgetId, gridLayout]) =>
        AbsoluteLayoutUtils.fromGridLayout(
          widgetId,
          gridLayout,
          heightMap.get(widgetId) ?? 0,
        ),
      )
      .sort((a, b) => (a.idx > b.idx ? 1 : -1));

    let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
    let isMovingRendered = false;
    for (const item of absoluteLayouts) {
      const top = getMaxHeight(maxHeights, item);
      if (
        !isMovingRendered &&
        moving &&
        AbsoluteLayoutUtils.collision({ ...item, top }, moving)
      ) {
        isMovingRendered = true;
        const ghost = { ...moving, top: getMaxHeight(maxHeights, moving) };
        maxHeights = setMaxHeight(maxHeights, ghost);
      }
      if (moving && moving.id === item.id) {
        continue;
      }
      item.top = getMaxHeight(maxHeights, item);
      maxHeights = setMaxHeight(maxHeights, item);
    }
    return absoluteLayouts;
  }, [layouts, heightMap, moving]);

  const containerHeight = useMemo(() => {
    const maxBottom = computedLayouts.reduce(
      (max, { top, height }) => Math.max(max, top + height),
      0,
    );

    const movingBottom =
      moving && moving.top + moving.height > maxBottom
        ? maxBottom + moving.height
        : 0;

    return Math.max(maxBottom, movingBottom, 200);
  }, [computedLayouts, moving]);

  useDragDropMonitor({
    onDragMove({ operation: { source, target } }) {
      const droppableRect = target?.element?.getBoundingClientRect();
      const draggableRect = source?.element?.getBoundingClientRect();
      if (isDropTarget && source && droppableRect && draggableRect) {
        setMoving({
          id: source.id as string,
          left: draggableRect.left - droppableRect.left,
          top: draggableRect.top - droppableRect.top,
          width: draggableRect.width,
          height: draggableRect.height,
        });
      } else {
        setMoving(null);
      }
    },
    onDragEnd({ operation: { source } }) {
      if (isDropTarget && moving && source) {
        const collisionIdx = computedLayouts.findIndex(
          (layout) => layout.top > moving.top,
        );
        if (collisionIdx > -1) {
          const preIdx = computedLayouts[collisionIdx - 1]?.idx ?? null;
          const nextIdx = computedLayouts[collisionIdx]?.idx ?? null;
          const newIdx = generateKeyBetween(preIdx, nextIdx);
          const newColumn = getColumn(moving);
          onMoving(source.id as string, newColumn, newIdx);
        } else {
          const lastIdx = computedLayouts.at(-1)?.idx ?? null;
          const newIdx = generateKeyBetween(lastIdx, null);
          const newColumn = getColumn(moving);
          onMoving(source.id as string, newColumn, newIdx);
        }
      }
      setMoving(null);
    },
  });

  return (
    <div
      ref={ref}
      className="relative duration-300"
      style={{ width: GRID_COLUMNS * COLUMN_WIDTH, height: containerHeight }}
    >
      {computedLayouts.map((layout) => (
        <ItemLayout
          key={layout.id}
          setHeight={setHeight}
          computedLayout={layout}
          disabled={disabled}
        >
          {children(layout.id)}
        </ItemLayout>
      ))}
    </div>
  );
}
