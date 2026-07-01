import { Button } from "@/components/ui/button";
import {
  TOOLBAR_REGISTRY,
  ToolbarType,
} from "@/features/template/components/toolbar/registry";
import clsx from "clsx";
import React, { useState } from "react";

export type ToolbarPanelProps = {};

const ToolbarPanel: React.FC<ToolbarPanelProps> = () => {
  const [type, setType] = useState<ToolbarType>(ToolbarType.Widget);

  return (
    <div className={clsx("flex flex-row", "w-[25em] h-full")}>
      <ToolbarContent type={type} className="flex-1" />

      <ToolbarMenuList type={type} setType={setType} />
    </div>
  );
};

interface ToolbarContentProps {
  type: ToolbarType;
  className: string;
}
const ToolbarContent: React.FC<ToolbarContentProps> = ({ type, className }) => {
  const def = TOOLBAR_REGISTRY[type];
  return (
    <div className={clsx("grid grid-rows-[auto_1fr]", className)}>
      <div className="bg-slate-100 p-2">
        <h6 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {def.label}
        </h6>
      </div>
      <def.Component />
    </div>
  );
};

interface ToolbarMenuListProps {
  type: ToolbarType;
  setType: (active: ToolbarType) => void;
}
const ToolbarMenuList: React.FC<ToolbarMenuListProps> = ({ type, setType }) => {
  return (
    <div className="p-2 bg-slate-100 h-full">
      <div className="flex flex-col gap-2">
        {Object.values(TOOLBAR_REGISTRY).map((def) => (
          <Button
            key={def.type}
            variant="ghost"
            className={clsx(
              "size-10",
              type === def.type &&
                "bg-slate-500 text-gray-200 hover:bg-slate-700 hover:text-gray-50",
            )}
            onClick={() => setType(def.type)}
          >
            <def.icon />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToolbarPanel;
