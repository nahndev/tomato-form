"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HostSelect } from "@/features/template/components/property/descriptors/apiCall/HostSelect";
import { JsonEditor } from "@/features/template/components/property/descriptors/apiCall/JsonEditor";
import { KeyValueListEditor } from "@/features/template/components/property/descriptors/apiCall/KeyValueListEditor";
import { MethodSelect } from "@/features/template/components/property/descriptors/apiCall/MethodSelect";
import { UrlEditor } from "@/features/template/components/property/descriptors/apiCall/UrlEditor";
import { WidgetPicker } from "@/features/template/components/property/descriptors/apiCall/WidgetPicker";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import {
  ApiCallMethod,
  ApiCallResponseType,
  type ApiCallConfig,
  type ApiCallJsonMapping,
} from "@/types/api-call";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { v4 } from "uuid";

const DEFAULT_CONFIG: ApiCallConfig = {
  method: ApiCallMethod.GET,
  url: "",
  params: [],
  headers: [],
  response: { type: ApiCallResponseType.JSON, show: false, jsonMappings: [] },
};

/**
 * Request + response configuration for the `api-call` widget. Ships every
 * editor from the ticket's Acceptance Criteria; does not execute the
 * request (see `docs/v1.1.0/add-widget-api-call.md`'s changelog).
 */
export function ApiCallDescriptor({
  widgetId,
  value,
  onChange,
}: WidgetPropertyFieldProps<"apiCall">) {
  const config = value ?? DEFAULT_CONFIG;
  const response = config.response;

  function patch(next: Partial<ApiCallConfig>) {
    onChange({ ...config, ...next });
  }

  function patchResponse(next: Partial<ApiCallConfig["response"]>) {
    patch({ response: { ...response, ...next } });
  }

  function addJsonMapping() {
    const jsonMappings = response.jsonMappings ?? [];
    patchResponse({ jsonMappings: [...jsonMappings, { id: v4(), key: "" }] });
  }

  function updateJsonMapping(id: string, next: Partial<ApiCallJsonMapping>) {
    patchResponse({
      jsonMappings: (response.jsonMappings ?? []).map((mapping) =>
        mapping.id === id ? { ...mapping, ...next } : mapping,
      ),
    });
  }

  function removeJsonMapping(id: string) {
    patchResponse({
      jsonMappings: (response.jsonMappings ?? []).filter((m) => m.id !== id),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">Request</p>

        <div className="flex flex-col gap-1.5">
          <Label>Host</Label>
          <HostSelect value={config.hostId} onChange={(hostId) => patch({ hostId })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>URL</Label>
          <div className="flex items-center gap-1.5">
            <MethodSelect
              value={config.method}
              onChange={(method) => patch({ method })}
            />
            <div className="flex-1">
              <UrlEditor
                widgetId={widgetId}
                value={config.url}
                onChange={(url) => patch({ url })}
              />
            </div>
          </div>
        </div>

        <KeyValueListEditor
          label="Params"
          widgetId={widgetId}
          value={config.params}
          onChange={(params) => patch({ params })}
        />

        <KeyValueListEditor
          label="Headers"
          widgetId={widgetId}
          value={config.headers}
          onChange={(headers) => patch({ headers })}
        />

        <div className="flex flex-col gap-1.5">
          <Label>Payload</Label>
          <JsonEditor
            widgetId={widgetId}
            value={config.payload}
            onChange={(payload) => patch({ payload })}
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">Response</p>

        <div className="flex flex-col gap-1.5">
          <Label>Type</Label>
          <Select
            value={response.type}
            onValueChange={(type) =>
              patchResponse({ type: type as ApiCallResponseType })
            }
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ApiCallResponseType.JSON}>JSON</SelectItem>
              <SelectItem value={ApiCallResponseType.IMAGE}>Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={response.show ?? false}
            onCheckedChange={(checked) => patchResponse({ show: checked === true })}
          />
          Show after load
        </label>

        {response.type === ApiCallResponseType.IMAGE ? (
          <div className="flex flex-col gap-1.5">
            <Label>Fill component</Label>
            <WidgetPicker
              excludeWidgetId={widgetId}
              value={response.imageWidgetId}
              onChange={(imageWidgetId) => patchResponse({ imageWidgetId })}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Fill mapping</Label>
            <div className="flex flex-col gap-1">
              {(response.jsonMappings ?? []).length === 0 && (
                <span className="text-xs text-muted-foreground">None yet</span>
              )}
              {(response.jsonMappings ?? []).map((mapping) => (
                <div key={mapping.id} className="flex items-center gap-1">
                  <Input
                    value={mapping.key}
                    placeholder="data.user.name"
                    onChange={(e) =>
                      updateJsonMapping(mapping.id, { key: e.target.value })
                    }
                  />
                  <WidgetPicker
                    excludeWidgetId={widgetId}
                    value={mapping.widgetId}
                    onChange={(id) => updateJsonMapping(mapping.id, { widgetId: id })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="size-8 shrink-0"
                    onClick={() => removeJsonMapping(mapping.id)}
                    aria-label="Delete"
                  >
                    <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addJsonMapping}>
              <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
              Add mapping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
