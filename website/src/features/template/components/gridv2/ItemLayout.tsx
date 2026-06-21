import { AbsoluteLayout } from "@/features/template/libs/grid-layout/types";
import { useDraggable } from "@dnd-kit/react";
import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

export type ItemLayoutProps = {
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  children?: React.ReactNode;
};

const ItemLayout: React.FC<ItemLayoutProps> = ({
  setHeight,
  computedLayout,
  children,
}: ItemLayoutProps) => {
  const { ref: draggableRef } = useDraggable({ id: computedLayout.id });

  const ref = useRef<HTMLDivElement>(null);
  useResizeObserver({
    ref,
    onResize: ({ height }) => setHeight(computedLayout.id, height ?? 0),
  });

  return (
    <div
      ref={draggableRef}
      className="bg-blue-500 absolute"
      style={{ ...computedLayout }}
    >
      <div ref={ref} className="bg-red-500 h-min w-full">
        {children}
      </div>
    </div>
  );
};

export default ItemLayout;
