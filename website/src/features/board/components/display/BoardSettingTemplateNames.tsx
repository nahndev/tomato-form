import type { Template } from "@/types/template";
import clsx from "clsx";

export interface BoardSettingTemplateNamesProps {
  templates: Template[];
}

/** Fixed left column of row headers, aligned with the value rows inside each BoardSettingColumn. */
const BoardSettingTemplateNames: React.FC<BoardSettingTemplateNamesProps> = ({
  templates,
}) => {
  return (
    <div role="row" className="flex flex-col w-40">
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
          <span className="text-sm">{template.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BoardSettingTemplateNames;
