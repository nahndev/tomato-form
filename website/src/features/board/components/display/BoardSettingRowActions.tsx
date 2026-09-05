import { Button } from "@/components/ui/button";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";

export interface BoardSettingRowActionsProps {
  templates: Template[];
  onRemoveTemplate: (templateId: string) => void;
}

/** Fixed right column of per-row actions, aligned with the value rows inside each BoardSettingColumn. */
const BoardSettingRowActions: React.FC<BoardSettingRowActionsProps> = ({
  templates,
  onRemoveTemplate,
}) => {
  return (
    <div role="row" className="flex flex-col">
      <div role="cell" className="h-10" />
      <div role="cell" className="h-10" />
      {templates.map((template, idx) => (
        <div
          key={template.id}
          role="cell"
          className={clsx(
            "h-10 flex items-center",
            idx % 2 === 1 && "bg-slate-100",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemoveTemplate(template.id)}
            aria-label={`Unlink ${template.name} from board`}
          >
            <TomatoIcon icon={TomatoIconKey.Close} className="size-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BoardSettingRowActions;
