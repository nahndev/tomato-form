"use client";

import TemplateCanvas from "@/features/template/components/template/TemplateCanvas";
import ToolbarPanel from "@/features/template/components/toolbar/ToolbarPanel";
import { TemplateCopilot } from "@/features/template/sync/copilot";

interface TemplateBuilderProps {}

const TemplateBuilder: React.FC<TemplateBuilderProps> = () => {
  return (
    <TemplateCopilot>
      <div className="size-full overflow-hidden flex flex-row">
        <div className="flex-1">
          <TemplateCanvas />
        </div>
        <ToolbarPanel />
      </div>
    </TemplateCopilot>
  );
};

export default TemplateBuilder;
