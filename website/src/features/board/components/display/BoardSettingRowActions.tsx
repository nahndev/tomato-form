import type { Template } from "@/types/template";
import clsx from "clsx";

export interface BoardSettingRowActionsProps {
  templates: Template[];
}

/** Fixed right column of per-row actions, aligned with the value rows inside each BoardSettingColumn. */
const BoardSettingRowActions: React.FC<BoardSettingRowActionsProps> = ({
  templates,
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
          <div>action</div>
        </div>
      ))}
    </div>
  );
};

export default BoardSettingRowActions;
