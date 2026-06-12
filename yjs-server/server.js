const http = require("http");
const WebSocket = require("ws");
const { setupWSConnection, docs } = require("y-websocket/bin/utils");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = parseInt(process.env.PORT || "3028", 10);
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3022";
const SYNC_DEBOUNCE_MS = parseInt(process.env.SYNC_DEBOUNCE_MS || "1000", 10);

const syncTimers = new Map();

function getDocState(doc) {
  return {
    name: doc.getText("name").toString(),
    widgets: Object.fromEntries(doc.getMap("widgets").entries()),
    layouts: Object.fromEntries(doc.getMap("layouts").entries()),
    properties: Object.fromEntries(doc.getMap("properties").entries()),
  };
}

async function syncToBackend(templateId, doc) {
  const state = getDocState(doc);
  try {
    const res = await fetch(`${BACKEND_URL}/api/templates/${templateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[sync] template ${templateId} → ${res.status}`, text);
    }
  } catch (err) {
    console.error(`[sync] template ${templateId} failed:`, err.message);
  }
}

function scheduleSyncToBackend(templateId, doc) {
  const existing = syncTimers.get(templateId);
  if (existing) clearTimeout(existing);

  syncTimers.set(
    templateId,
    setTimeout(() => {
      syncTimers.delete(templateId);
      syncToBackend(templateId, doc);
    }, SYNC_DEBOUNCE_MS),
  );
}

const server = http.createServer((_, res) => {
  res.writeHead(200);
  res.end("Tomato Form — Yjs WebSocket Server");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection:", req.url);
  console.log("Query params:", req.url?.split("?")[1] ?? "none");
  setupWSConnection(ws, req);

  // Room name is the URL path without leading "/": "template-{id}"
  const docName = (req.url ?? "").replace(/^\//, "").split("?")[0];
  if (!docName.startsWith("template-")) return;

  const templateId = docName.slice("template-".length);

  // setupWSConnection registers the doc synchronously; access it next tick
  setImmediate(() => {
    const doc = docs.get(docName);
    if (!doc) return;

    doc.on("update", (_update, origin) => {
      // Skip echoing back updates that came from the backend initial seed
      if (origin === "backend-seed") return;
      scheduleSyncToBackend(templateId, doc);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Yjs WebSocket server  ws://${HOST}:${PORT}`);
  console.log(`Backend sync target   ${BACKEND_URL}`);
});
