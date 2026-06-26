import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useTemplateDocContext,
  useWidgetSelection,
} from "@/features/template/components/provider/TemplateProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { cn } from "@/lib/utils";
import { Session, Widget, WidgetProperties } from "@/types/template";
import { useMemo } from "react";
import * as R from "remeda";

export type StructureToolbarBoxProps = {};

interface WidgetThumbnail {
  id: Widget["id"];
  name: WidgetProperties["label"];
  type: Widget["type"];
}
interface SessionThumbnail {
  id: Session["id"];
  name: Session["name"];
  widgets: WidgetThumbnail[];
}

const StructureToolbarBox: React.FC<StructureToolbarBoxProps> = () => {
  const { state } = useTemplateDocContext();
  const { sessions, widgets, properties, widgetToSession, layouts } = state;

  const tree = useMemo<SessionThumbnail[]>(
    () =>
      R.pipe(
        R.values(sessions),
        R.map((session) => ({
          id: session.id,
          name: session.name,
          widgets: R.pipe(
            widgetToSession,
            R.entries(),
            R.filter(([_, value]) => value === session.id),
            R.sortBy(([key, _]) => layouts[key].idx),
            R.map(([key, _]) => ({
              id: key,
              name: properties[key]?.label,
              type: widgets[key].type,
            })),
          ),
        })),
      ),
    [sessions, widgets, properties, widgetToSession],
  );

  return (
    <ScrollArea className="p-2 pb-0">
      {tree.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No sections yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {tree.map((session) => (
            <SessionGroup key={session.id} session={session} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

interface SessionGroupProps {
  session: SessionThumbnail;
}
const SessionGroup: React.FC<SessionGroupProps> = ({ session }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="truncate text-sm font-medium">{session.name}</p>
      {session.widgets.length === 0 ? (
        <p className="px-3 py-1 text-xs text-muted-foreground">
          No fields in this section
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {session.widgets.map((widget) => (
            <WidgetRow key={widget.id} widget={widget} />
          ))}
        </div>
      )}
    </div>
  );
};

interface WidgetRowProps {
  widget: WidgetThumbnail;
}
const WidgetRow: React.FC<WidgetRowProps> = ({ widget }) => {
  const { isSelected, select } = useWidgetSelection();
  const def = WIDGET_REGISTRY[widget.type];
  const Icon = def.icon;

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
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{widget.name || "(no label)"}</span>
    </div>
  );
};

export default StructureToolbarBox;
