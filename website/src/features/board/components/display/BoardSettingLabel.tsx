import { ButtonIcon } from "@/components/ui/button-icon";
import { Typography } from "@/components/ui/typography";
import AddTemplateButton from "@/features/board/components/display/AddTemplateButton";
import SessionCard from "@/features/board/components/display/session/SessionCard";
import { RowWrapper } from "@/features/board/components/display/wrapper/RowWrapper";
import { ZebraCell } from "@/features/board/components/display/wrapper/ZebraCell";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface BoardSettingLabelProps {
  templates: Template[];
  onAdd: (templateId: string) => void;
}

/** Fixed left column of row headers, aligned with the value rows inside each BoardSettingColumn. */
const BoardSettingLabel: React.FC<BoardSettingLabelProps> = ({ templates, onAdd }) => {
  return (
    <RowWrapper>
      <div role="cell" className="h-12 flex items-center px-2" />
      <SessionCard title="Thuoc tinh cot">
        <ZebraCell className="w-40 gap-2 p-2">
          <TomatoIcon icon={TomatoIconKey.Code} />
          <div className="flex flex-col">
            <Typography className="text-xs font-bold">Size</Typography>
            <Typography className="text-tiny text-gray-500">Flex/Px</Typography>
          </div>
        </ZebraCell>
        <ZebraCell index={1} className="w-40 gap-2 p-2">
          <TomatoIcon icon={TomatoIconKey.Type} />
          <div className="flex flex-col">
            <Typography className="text-xs font-bold">Type</Typography>
            <Typography className="text-tiny text-gray-500">
              Text/Date/Number
            </Typography>
          </div>
        </ZebraCell>
      </SessionCard>
      <SessionCard title="Templates">
        <div className="flex flex-col">
          {templates.map((template, idx) => (
            <ZebraCell key={template.id} index={idx} className="px-2">
              <ButtonIcon icon={TomatoIconKey.Trash} />
              <span className="text-sm truncate">{template.name}</span>
            </ZebraCell>
          ))}
          <div className="px-2 py-2 border-t border-border bg-muted/20">
            <AddTemplateButton
              linkedTemplateIds={templates.map((t) => t.id)}
              onAdd={onAdd}
            />
          </div>
        </div>
      </SessionCard>
    </RowWrapper>
  );
};

export default BoardSettingLabel;
