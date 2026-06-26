"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplateMode } from "@/features/template/components/provider/TemplateProvider";
import TemplateCanvas from "@/features/template/components/template/TemplateCanvas";
import ToolbarPanel from "@/features/template/components/toolbar/ToolbarPanel";
import { TemplateMode } from "@/types/template";
import { WidgetPicker } from "./toolbar/creation/WidgetPicker";

interface TemplateBuilderProps {}

const TemplateBuilder: React.FC<TemplateBuilderProps> = () => {
  const mode = useTemplateMode();
  const viewOnly = mode === TemplateMode.VIEW;

  return (
    <div className="size-full overflow-hidden flex flex-row">
      {!viewOnly && (
        <div className="w-64 flex flex-col gap-4 border-r p-4">
          <ScrollArea className="flex-1">
            <WidgetPicker />
          </ScrollArea>
        </div>
      )}

      {/* Center: canvas */}
      <div className="flex-1">
        <TemplateCanvas />
      </div>

      {/* Right panel: properties */}
      {!viewOnly && <ToolbarPanel />}
    </div>
  );
};

export default TemplateBuilder;
