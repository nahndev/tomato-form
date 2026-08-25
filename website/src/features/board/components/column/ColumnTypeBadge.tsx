import { DISPLAY_TYPE_REGISTRY } from "@/features/template/components/widget/display-type.registry";
import type { DisplayType } from "@/types/display-type";
import { TomatoIcon } from "@tomato/icon";

export interface ColumnTypeBadgeProps {
  type: DisplayType;
}

const ColumnTypeBadge: React.FC<ColumnTypeBadgeProps> = ({ type }) => {
  const definition = DISPLAY_TYPE_REGISTRY[type];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{ borderColor: definition.color, color: definition.color }}
    >
      <TomatoIcon icon={definition.icon} className="size-3.5" />
      {definition.label}
    </span>
  );
};

export default ColumnTypeBadge;
