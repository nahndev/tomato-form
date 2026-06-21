import ItemLayout from "@/features/template/components/gridv2/ItemLayout";
import {
  COLUMN_WIDTH,
  GRID_COLUMNS,
} from "@/features/template/libs/grid-layout/constants";
import {
  AbsoluteLayoutUtils,
  getMaxHeight,
  LayoutRect,
  setMaxHeight,
} from "@/features/template/libs/grid-layout/utils";
import { GridLayout } from "@/types/template";
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { useMemo, useState } from "react";
import { useMap } from "usehooks-ts";

export interface ContainerLayoutProps {
  id: string;
  layouts: Record<string, GridLayout>;
  children: (id: string) => React.ReactNode;
  onDrop: (id: string, idx: string) => void;
}

export function ContainerLayout({
  id,
  children,
  layouts,
}: ContainerLayoutProps) {
  const [heightMap, { set: setHeight }] = useMap<string, number>();
  const { ref, isDropTarget } = useDroppable({ id });
  const [moving, setMoving] = useState<LayoutRect | null>(null);

  const computedLayouts = useMemo(() => {
    const absoluteLayouts = Object.entries(layouts)
      .map(([id, layout]) =>
        AbsoluteLayoutUtils.fromGridLayout(id, layout, heightMap.get(id) ?? 0),
      )
      .sort((a, b) => (a.idx > b.idx ? 1 : -1));

    let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
    for (const item of absoluteLayouts) {
      item.top = getMaxHeight(maxHeights, item);
      if (moving && AbsoluteLayoutUtils.collision(item, moving)) {
        const ghost = { ...moving, top: getMaxHeight(maxHeights, moving) };
        maxHeights = setMaxHeight(maxHeights, ghost);
        item.top = getMaxHeight(maxHeights, item);
      }
      maxHeights = setMaxHeight(maxHeights, item);
    }
    return absoluteLayouts;
  }, [layouts, heightMap, moving]);

  const containerHeight = useMemo(() => {
    return computedLayouts.reduce(
      (max, layout) => Math.max(max, layout.top + layout.height),
      200,
    );
  }, [computedLayouts]);

  useDragDropMonitor({
    onDragMove({ operation: { source, target } }) {
      const droppableRect = target?.element?.getBoundingClientRect();
      const draggableRect = source?.element?.getBoundingClientRect();
      if (isDropTarget && droppableRect && draggableRect) {
        setMoving({
          left: draggableRect.left - droppableRect.left,
          top: draggableRect.top - droppableRect.top,
          width: draggableRect.width,
          height: draggableRect.height,
        });
      } else {
        setMoving(null);
      }
    },
    onDragEnd() {
      setMoving(null);
    },
  });

  return (
    <div
      ref={ref}
      className="bg-blue-200 relative"
      style={{ width: GRID_COLUMNS * COLUMN_WIDTH, height: containerHeight }}
    >
      {computedLayouts.map((layout) => (
        <ItemLayout
          key={layout.id}
          setHeight={setHeight}
          computedLayout={layout}
        >
          {children(layout.id)}
        </ItemLayout>
      ))}
    </div>
  );
}
