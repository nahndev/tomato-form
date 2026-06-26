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
      <div className="flex-1">
        <ToolbarContent type={type} />
      </div>
      <ToolbarMenuList type={type} setType={setType} />
    </div>
  );
};

interface ToolbarContentProps {
  type: ToolbarType;
}
const ToolbarContent: React.FC<ToolbarContentProps> = ({ type }) => {
  const def = TOOLBAR_REGISTRY[type];
  return (
    <div className="flex flex-col gap-3">
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
