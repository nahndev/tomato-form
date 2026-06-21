import { AbsoluteLayout } from "@/features/template/libs/grid-layout/types";
import { useDraggable, useDragOperation } from "@dnd-kit/react";
import clsx from "clsx";
import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

export type ItemLayoutProps = {
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  children?: React.ReactNode;
  disabled?: boolean;
};

const ItemLayout: React.FC<ItemLayoutProps> = ({
  setHeight,
  computedLayout,
  disabled,
  children,
}: ItemLayoutProps) => {
  const { source } = useDragOperation();
  const { ref: draggableRef, isDragging } = useDraggable({
    id: computedLayout.id,
    disabled: disabled,
  });

  const ref = useRef<HTMLDivElement>(null);
  useResizeObserver({
    ref,
    onResize: ({ height }) => setHeight(computedLayout.id, height ?? 0),
  });

  return (
    <div
      ref={draggableRef}
      className={clsx("absolute", source && !isDragging && "duration-300")}
      style={{ ...computedLayout }}
    >
      <div ref={ref} className="h-min w-full">
        {children}
      </div>
    </div>
  );
};

export default ItemLayout;
