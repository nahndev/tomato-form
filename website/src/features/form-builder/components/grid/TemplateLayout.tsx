"use client";

import type { SessionGroup } from "../../libs/grid-layout/types";
import { SessionLayout } from "./SessionLayout";
import { SessionLayoutProvider } from "./SessionLayoutContext";
import { TemplateLayoutProvider } from "./TemplateLayoutContext";
import { WidgetLayout } from "./WidgetLayout";

interface TemplateLayoutProps {
  sessionGroups: SessionGroup[];
  onMoveWidget: (
    widgetId: string,
    sessionId: string,
    column: number,
    idx: string,
  ) => void;
  renderWidget: (id: string) => React.ReactNode;
}

export function TemplateLayout({
  sessionGroups,
  onMoveWidget,
  renderWidget,
}: TemplateLayoutProps) {
  return (
    <TemplateLayoutProvider onMoveWidget={onMoveWidget}>
      <div className="flex flex-col gap-4">
        {sessionGroups.map(({ sessionId, session, layouts }) => (
          <div key={sessionId} className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {session.name}
            </p>
            <SessionLayoutProvider
              sessionId={sessionId}
              layoutMap={layouts}
              session={session}
            >
              <SessionLayout>
                {Object.keys(layouts).map((id) => (
                  <WidgetLayout key={id} id={id}>
                    {renderWidget(id)}
                  </WidgetLayout>
                ))}
              </SessionLayout>
            </SessionLayoutProvider>
          </div>
        ))}
      </div>
    </TemplateLayoutProvider>
  );
}
