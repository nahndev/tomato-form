# Handle form feature

## Tasks

- [x] Implement form UI components
- [x] Include create, edit, and view modes for forms
- [x] Include add widget, remove widget, and reorder widget functionalities

## Template schemas

```ts
{
  "id": "string",
  "name": "string",
  "widgets": Map<string, Widget>,
  "layouts": Map<string, Layout>,
  "properties": Map<string, WidgetProperties>
}


// Widget
{
  "id": "string",
  "type": "string"
}

// Layout
{
  "width": number,
  "height": number,
  "x": number,
  "y": number
}

// WidgetProperties
{
  "label": "string"
}

```

## Implement with Yjs

- [x] Use Yjs to manage form state and enable real-time collaboration
- [x] Integrate Yjs with React components for seamless updates
- [x] Handle conflict resolution and synchronization across clients
- [x] Create docker-compose.yaml to run Yjs server and backend together
- [x] When the document in yjs, sync with the backend to persist form data and ensure data consistency across sessions
- [x] Create Template schema to saving `template` in Yjs document as json string in mongoDB.
