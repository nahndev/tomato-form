import { ScrollArea } from "@/components/ui/scroll-area";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { cn } from "@/lib/utils";
import { Session, Widget } from "@/types/template";
import { TomatoIcon } from "@tomato/icon";
import { useMemo } from "react";
import * as R from "remeda";

export type StructureToolbarBoxProps = {};

interface SessionThumbnail {
  session: Session;
  widgets: Widget[];
}

const StructureToolbarBox: React.FC<StructureToolbarBoxProps> = () => {
  const { sessions, widgets, widgetToSession, layouts } = useTemplateState();

  const tree = useMemo<SessionThumbnail[]>(
    () =>
      R.pipe(
        R.values(sessions),
        R.map((session) => ({
          session,
          widgets: R.pipe(
            widgetToSession,
            R.entries(),
            R.filter(([_, value]) => value === session.id),
            R.sortBy(([key, _]) => layouts[key].idx),
            R.map(([key, _]) => widgets[key]),
          ),
        })),
      ),
    [sessions, widgets, widgetToSession, layouts],
  );

  return (
    <ScrollArea className="p-2 pb-0">
      {tree.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No sections yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {tree.map((entry) => (
            <SessionGroup key={entry.session.id} entry={entry} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

interface SessionGroupProps {
  entry: SessionThumbnail;
}
const SessionGroup: React.FC<SessionGroupProps> = ({ entry }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="truncate text-sm font-medium">{entry.session.name}</p>
      {entry.widgets.length === 0 ? (
        <p className="px-3 py-1 text-xs text-muted-foreground">
          No fields in this section
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {entry.widgets.map((widget) => (
            <WidgetRow key={widget.id} widget={widget} />
          ))}
        </div>
      )}
    </div>
  );
};

interface WidgetRowProps {
  widget: Widget;
}
const WidgetRow: React.FC<WidgetRowProps> = ({ widget }) => {
  const { isSelected, select } = useWidgetSelection();
  const def = WIDGET_REGISTRY[widget.type];

  return (
    <div
      className={cn(
        isSelected(widget) && "bg-orange-500 text-slate-50",
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
        "hover:bg-orange-300",
        "cursor-pointer",
      )}
      onClick={() => select(widget)}
    >
      <TomatoIcon
        icon={def.icon}
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <span className="truncate">{widget.label || "(no label)"}</span>
    </div>
  );
};

export default StructureToolbarBox;
