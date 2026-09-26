export const ApiCallMethod = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
  PUT: "PUT",
} as const;
export type ApiCallMethod = (typeof ApiCallMethod)[keyof typeof ApiCallMethod];

export const ApiCallValueSource = {
  STATIC: "static",
  WIDGET: "widget",
} as const;
export type ApiCallValueSource =
  (typeof ApiCallValueSource)[keyof typeof ApiCallValueSource];

/** One params/headers row - either a literal value or another widget's value. */
export interface ApiCallKeyValue {
  id: string;
  key: string;
  source: ApiCallValueSource;
  /** When `source` is `STATIC`. */
  value?: string;
  /** When `source` is `WIDGET`. */
  widgetId?: string;
}

export const ApiCallResponseType = {
  JSON: "json",
  IMAGE: "image",
} as const;
export type ApiCallResponseType =
  (typeof ApiCallResponseType)[keyof typeof ApiCallResponseType];

/** Maps one dot-path key out of a JSON response body to a widget to fill. */
export interface ApiCallJsonMapping {
  id: string;
  key: string;
  widgetId?: string;
}

export interface ApiCallResponseConfig {
  type: ApiCallResponseType;
  /** Display the response after it loads. */
  show?: boolean;
  /** IMAGE only - widget to fill with the received image. */
  imageWidgetId?: string;
  /** JSON only - key/widget mappings applied after load. */
  jsonMappings?: ApiCallJsonMapping[];
}

/**
 * Full request/response configuration for an `api-call` widget.
 * `url` and `payload` may embed `{{widget.label}}` tokens, substituted with
 * that widget's value at request time.
 */
export interface ApiCallConfig {
  hostId?: string;
  method: ApiCallMethod;
  url: string;
  params: ApiCallKeyValue[];
  headers: ApiCallKeyValue[];
  payload?: string;
  response: ApiCallResponseConfig;
}
