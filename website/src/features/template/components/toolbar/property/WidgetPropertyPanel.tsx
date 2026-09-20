"use client";

import { Button } from "@/components/ui/button";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WidgetPropertyBox } from "@/features/template/components/toolbar/property/WidgetPropertyBox";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { useEffect, useState } from "react";

export type WidgetPropertyPanelProps = {};

/**
 * Left-hand mirror of `ToolbarPanel`: a standalone property panel with its own
 * icon strip on the outer edge. Auto-opens whenever a widget gets selected.
 */
const WidgetPropertyPanel: React.FC<WidgetPropertyPanelProps> = () => {
  const { selected } = useWidgetSelection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) {
      setOpen(true);
    }
  }, [selected?.id]);

  return (
    <div className={clsx("flex flex-row h-full", open && "w-[25em]")}>
      <div className="p-2 bg-slate-100 h-full">
        <Button
          variant="ghost"
          className={clsx(
            "size-10",
            open &&
              "bg-slate-500 text-gray-200 hover:bg-slate-700 hover:text-gray-50",
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          <TomatoIcon icon={TomatoIconKey.Settings2} />
        </Button>
      </div>

      {open && (
        <div className="grid grid-rows-[auto_1fr] flex-1 overflow-hidden">
          <div className="bg-slate-100 p-2">
            <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Properties
            </h6>
          </div>
          <WidgetPropertyBox />
        </div>
      )}
    </div>
  );
};

export default WidgetPropertyPanel;
