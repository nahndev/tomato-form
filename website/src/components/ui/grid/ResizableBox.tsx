import { COLUMN_WIDTH } from "@/components/ui/grid/constants";
import { AbsoluteLayout } from "@/components/ui/grid/types";
import clsx from "clsx";
import { Resizable } from "re-resizable";

export interface ResizableBoxProps {
  value: AbsoluteLayout;
  disabled?: boolean;
  onChange: (width: number) => void;
  onResizingChange: (resizing: boolean) => void;
  children: React.ReactNode;
}

export function ResizableBox({
  value,
  disabled,
  onChange,
  onResizingChange,
  children,
}: ResizableBoxProps) {
  return (
    <Resizable
      size={{ width: value.width, height: "auto" }}
      enable={{ right: !disabled }}
      grid={[COLUMN_WIDTH, 1]}
      handleStyles={{ right: { right: -4, width: 8 } }}
      handleClasses={{
        right: clsx(
          "!h-full transition-colors",
          !disabled && "cursor-ew-resize hover:bg-primary/40",
        ),
      }}
      handleComponent={{
        right: (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="h-full w-full cursor-[inherit] border-0 p-0"
          />
        ),
      }}
      onResizeStart={() => onResizingChange(true)}
      onResizeStop={(_event, _direction, _elementRef, delta) => {
        if (delta.width !== 0) {
          onChange(value.width + delta.width);
        }
        onResizingChange(false);
      }}
    >
      {children}
    </Resizable>
  );
}
