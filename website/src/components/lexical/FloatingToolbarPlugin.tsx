import { useEditorFocus } from "@/components/lexical/useEditorFocus";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export function FloatingToolbarPlugin({ children }: PropsWithChildren) {
  const hasSelection = useEditorFocus();

  if (!hasSelection) return null;

  return (
    <div
      className={clsx(
        "fixed w-screen right-0 bottom-0",
        "flex flex-row",
        "bg-white",
        "rounded-lg bg-popover shadow-md ring-1 ring-foreground/10",
      )}
    >
      <div className="flex-1" />
      {children}
    </div>
  );
}
