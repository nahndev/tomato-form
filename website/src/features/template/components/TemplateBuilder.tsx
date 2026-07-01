"use client";

import { useTemplateMode } from "@/features/template/components/provider/TemplateProvider";
import TemplateCanvas from "@/features/template/components/template/TemplateCanvas";
import ToolbarPanel from "@/features/template/components/toolbar/ToolbarPanel";
import { TemplateMode } from "@/types/template";

interface TemplateBuilderProps {}

const TemplateBuilder: React.FC<TemplateBuilderProps> = () => {
  const mode = useTemplateMode();
  const viewOnly = mode === TemplateMode.VIEW;

  return (
    <div className="size-full overflow-hidden flex flex-row">
      <div className="flex-1">
        <TemplateCanvas />
      </div>

      {!viewOnly && <ToolbarPanel />}
    </div>
  );
};

export default TemplateBuilder;
