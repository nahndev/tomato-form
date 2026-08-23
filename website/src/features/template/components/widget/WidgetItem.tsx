"use client";

import { Button } from "@/components/ui/button";
import { useTemplateMode } from "@/features/template/components/provider/TemplateBuilderProvider";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WidgetProvider } from "@/features/template/components/widget/WidgetProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useWidgetActions } from "@/features/template/hooks/actions/useWidgetActions";
import { useWidgetState } from "@/features/template/hooks/state/useWidgetState";
import { TemplateMode, type Widget } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface WidgetItemProps {
  widget: Widget;
}

export function WidgetItem({ widget }: WidgetItemProps) {
  return (
    <WidgetProvider widgetId={widget.id}>
      <WidgetBox widget={widget}>
        <WidgetPreview widget={widget} />
      </WidgetBox>
    </WidgetProvider>
  );
}

function WidgetBox({
  widget,
  children,
}: PropsWithChildren<{ widget: Widget }>) {
  const mode = useTemplateMode();
  const { properties } = useWidgetState();
  const { removeWidget } = useWidgetActions();
  const { isSelected, toggle } = useWidgetSelection();
  const isShowSelectedBorder = mode === TemplateMode.EDIT && isSelected(widget);

  return (
    <div className="p-2">
      <div
        className={clsx(
          "relative",
          "border border-dashed",
          isShowSelectedBorder ? "border-orange-500" : "border-transparent",
          "cursor-pointer",
        )}
        onClick={() => toggle(widget)}
      >
        <div inert className="min-w-0 flex-1 bg-white rounded-md">
          {children}
        </div>
        {isShowSelectedBorder && (
          <div
            className={clsx(
              "flex flex-row items-center gap-2",
              "absolute bottom-full w-full",
            )}
          >
            <div className="bg-orange-500 p-1">
              <p className="truncate text-xs text-white">
                {properties?.label || "(no label)"}
              </p>
            </div>
            <div className="flex-1" />
            <div>
              <Button
                className="size-6 rounded-none"
                onClick={() => removeWidget(widget.id)}
              >
                <TomatoIcon icon={TomatoIconKey.Trash} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WidgetPreview({ widget }: { widget: Widget }) {
  const { properties } = useWidgetState();
  const def = WIDGET_REGISTRY[widget.type];
  const WidgetItemComponent = def.component;
  return (
    <WidgetItemComponent
      widgetId={widget.id}
      properties={properties ?? def.defaultSettings}
    />
  );
}
