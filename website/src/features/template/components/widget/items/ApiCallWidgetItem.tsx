"use client";

import { Badge } from "@/components/ui/badge";
import type { FieldComponentProps } from "@/types/widget";

/**
 * Builder-time-only placeholder. Request execution and cross-widget
 * response-fill are configured via the property panel (`ApiCallDescriptor`)
 * but not yet run - see "Known gaps" in `docs/WIDGET.md`. This never calls
 * `fetch` or `onChange`.
 */
export function ApiCallWidgetItem({ widget }: FieldComponentProps<unknown>) {
  const apiCall = widget.apiCall;

  return (
    <div className="flex flex-col gap-1 rounded-md border border-dashed border-input p-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{apiCall?.method ?? "GET"}</Badge>
        <span className="truncate text-sm text-muted-foreground">
          {apiCall?.url || "No URL configured"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Not yet wired up to run - request execution is a follow-up ticket.
      </p>
    </div>
  );
}
