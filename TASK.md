# Update template structure.

```ts
export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  layouts: Record<string, GridLayout>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  widgetSessions: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}
```

Update to

```ts
export interface Template {
  id: string;
  name: string;
  widgets: Record<string, Widget>;
  properties: Record<string, WidgetProperties>;
  sessions: Record<string, Session>;
  layout: Record<
    string,
    {
      layouts: Record<string, GridLayout>;
      height: number;
    }
  >;
  createdAt?: string;
  updatedAt?: string;
}
```

## What is changed

- Add `layout` is layout of template
- `layout` is Record with sessionId and value is object with `layouts` and `height`
- `layouts` is Record with widgetId and value is GridLayout

## Tasks

- [x] Apply change
- [x] Update all related code to use new `layout` structure
- [x] Create new interface
- [x] Update using code to use new interface
