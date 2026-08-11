import { AbsoluteLayout, GridDndType } from "@/components/ui/grid/types";
import { useDraggable, useDragOperation } from "@dnd-kit/react";
import clsx from "clsx";
import { PropsWithChildren, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

export type ItemLayoutProps = PropsWithChildren<{
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  disabled?: boolean;
}>;

const ItemLayout: React.FC<ItemLayoutProps> = ({
  setHeight,
  computedLayout,
  disabled,
  children,
}: ItemLayoutProps) => {
  const { source } = useDragOperation();
  const { ref: draggableRef } = useDraggable({
    id: computedLayout.id,
    disabled: disabled,
    type: GridDndType.WIDGET,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  useResizeObserver({
    ref,
    onResize: ({ height }) => setHeight(computedLayout.id, height ?? 0),
  });

  return (
    <div
      ref={draggableRef}
      className={clsx(
        "item-layout",
        !source || (source.id !== computedLayout.id && "duration-300"),
      )}
    >
      <div ref={ref} className="h-min w-full">
        {children}
      </div>
    </div>
  );
};

export default ItemLayout;
