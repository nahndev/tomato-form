import clsx from "clsx";
import { Resizable, ResizeCallback } from "re-resizable";
import { useState } from "react";
import { COLUMN_WIDTH, GRID_COLUMNS } from "./constants";
import { AbsoluteLayout } from "./types";
import { getResizeSpan } from "./utils";

export interface ResizableBoxProps {
  value: AbsoluteLayout;
  disabled?: boolean;
  onChange?: (span: number) => void;
  children: React.ReactNode;
}

export function ResizableBox({
  value,
  disabled,
  onChange,
  children,
}: ResizableBoxProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [initialWidth, setInitialWidth] = useState(0);

  const handleResizeStart = () => {
    setIsResizing(true);
    setInitialWidth(value.width);
  };

  const handleResizeStop: ResizeCallback = (_e, _d, _el, delta) => {
    setIsResizing(false);
    setInitialWidth(0);
  };

  const handleResize: ResizeCallback = (_e, _d, _el, delta) => {
    if (delta.width !== 0) {
      const width = initialWidth + delta.width;
      const span = getResizeSpan({ ...value, width });
      onChange?.(span);
    }
  };

  return (
    <Resizable
      className="relative"
      size={{ width: value.width, height: "auto" }}
      enable={{ right: !disabled }}
      grid={[COLUMN_WIDTH, 1]}
      maxWidth={COLUMN_WIDTH * GRID_COLUMNS - value.left}
      minWidth={COLUMN_WIDTH}
      handleStyles={{ right: { width: 4, right: 4 } }}
      handleClasses={{
        right: clsx("my-auto transition-colors flex flex-col"),
      }}
      handleComponent={{
        right: (
          <>
            <div className="flex-1" />
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className={clsx(
                "h-4 w-1 cursor-[inherit]",
                !disabled &&
                  "cursor-ew-resize group-hover/grid-item:bg-primary/60",
              )}
            />
            <div className="flex-1" />
          </>
        ),
      }}
      onResizeStop={handleResizeStop}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
    >
      <div inert={isResizing}>{children}</div>
    </Resizable>
  );
}
