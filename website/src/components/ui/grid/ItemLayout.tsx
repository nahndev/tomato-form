import { ResizableBox } from "@/components/ui/grid/ResizableBox";
import { AbsoluteLayout, GridDndType } from "@/components/ui/grid/types";
import { useDraggable, useDragOperation } from "@dnd-kit/react";
import clsx from "clsx";
import { PropsWithChildren, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

export type ItemLayoutProps = PropsWithChildren<{
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  disabled?: boolean;
  onResize: (id: string, left: number, width: number) => void;
}>;

const ItemLayout: React.FC<ItemLayoutProps> = ({
  setHeight,
  computedLayout,
  disabled,
  onResize,
  children,
}: ItemLayoutProps) => {
  const { source } = useDragOperation();
  const [resizing, setResizing] = useState<boolean>(false);
  const { ref: draggableRef } = useDraggable({
    id: computedLayout.id,
    disabled: disabled && resizing,
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
        "absolute",
        !source || (source.id !== computedLayout.id && "duration-300"),
      )}
      style={{ ...computedLayout }}
    >
      <ResizableBox
        value={computedLayout}
        disabled={disabled}
        onResizingChange={setResizing}
        onChange={(width) =>
          onResize(computedLayout.id, computedLayout.left, width)
        }
      >
        <div ref={ref} className="h-min w-full">
          {children}
        </div>
      </ResizableBox>
    </div>
  );
};

export default ItemLayout;
