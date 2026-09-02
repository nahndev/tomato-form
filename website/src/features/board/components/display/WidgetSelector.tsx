import { Select } from "@/components/ui/select";
import {
  getDataFieldWidgets,
  getWidgetOptionLabel,
} from "@/features/board/utils/boardColumnWidgets";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { BoardColumn } from "@/types/board";
import type { TemplateVersion } from "@/types/template";

export interface WidgetSelectorProps {
  column: BoardColumn;
  templateId: string;
  templateName: string;
  latestVersion: TemplateVersion | undefined;
  onPick: (widgetId: string) => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  column,
  templateId,
  templateName,
  latestVersion,
  onPick,
}) => {
  const ariaLabel = `Widget for ${templateName}`;

  if (!latestVersion) {
    return (
      <Select disabled value="" aria-label={ariaLabel}>
        <option value="">No published version</option>
      </Select>
    );
  }

  const snapshot = latestVersion.snapshot;
  const options = getDataFieldWidgets(snapshot).filter(
    (widget) =>
      column.type === null ||
      WIDGET_DISPLAY_TYPE_REGISTRY[widget.type].includes(column.type),
  );

  const selectedWidgetId =
    column.items.find((item) => item.templateId === templateId)?.widgetId ?? "";

  return (
    <Select
      value={selectedWidgetId}
      onChange={(e) => onPick(e.target.value)}
      disabled={options.length === 0}
      aria-label={ariaLabel}
    >
      <option value="">
        {options.length === 0 ? "No matching widget" : "Select widget"}
      </option>
      {options.map((widget) => (
        <option key={widget.id} value={widget.id}>
          {getWidgetOptionLabel(snapshot, widget.id)}
        </option>
      ))}
    </Select>
  );
};

export default WidgetSelector;
