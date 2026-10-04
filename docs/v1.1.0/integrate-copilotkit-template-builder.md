# TemplateBuilder integrate @copilotkit/react-core and @copilotkit/runtimes

## Currently

- `TemplateBuilder` ([website/src/features/template/components/TemplateBuilder.tsx](../../website/src/features/template/components/TemplateBuilder.tsx)) is a plain layout: `TemplateCanvas` on the left and `ToolbarPanel` on the right. It has no AI/copilot capability.
- It is rendered by `website/src/app/templates/[id]/page.tsx`, wrapped in `TemplateProvider` and `TemplateBuilderProvider` (the latter only carries view/edit `mode`).
- No `@copilotkit/*` package is a dependency of `website/package.json` or `server/package.json`, and no CopilotKit provider or runtime endpoint exists.
- The website (Next.js 15, React 18) has no `app/api` route handlers; the REST API lives in `server` (NestJS 10).
- The ticket title names `@copilotkit/runtimes`. The npm package is believed to be `@copilotkit/runtime` (singular), so the package name needs confirming.

## Acceptance Criteria

- Integrate @copilotkit/react-core and @copilotkit/runtimes

## Solutions

- In `website/src/features/template/sync/copilot`
- Add new component wrapper
- Add new file for widget functions (current only support for widget)
- Add new component for chat popup

- Setup for `@copilotkit/runtimes`
- Docker copy IA setup by docker from `/home/dev/sources/orange`
- Link `@copilotkit/runtimes` to `ollama`

## Changelogs

- Package name confirmed: `@copilotkit/runtime` (singular). Everything uses the CopilotKit **v2** API: `@copilotkit/runtime/v2` in the new `copilot-server`, `@copilotkit/react-core/v2` in `website` (the chat popup is v2's `CopilotPopup`, so `@copilotkit/react-ui` is not used).
- Runtime host: new standalone NestJS workspace package `copilot-server` (`@tomato-form/copilot-server`, port 3030, modelled on `yjs-server`). `CopilotService` builds a v2 `CopilotRuntime` with one `BuiltInAgent` (id `default`, system prompt in the service) and exposes `createCopilotExpressHandler` as an Express router mounted in `main.ts` at `/copilotkit` (`bodyParser: false`; the router applies its own CORS from `CORS_ORIGIN`). `tsconfig.json` uses `module`/`moduleResolution` `node16` so the `@copilotkit/runtime/v2*` subpath exports resolve.
- Ollama: `ollama` service + `ollama_data` volume added to `docker-compose.yaml` (copied from `/home/dev/sources/orange`), `docker/ollama/pull-model.sh` pulls `qwen2.5:7b`. The agent reaches it with `@ai-sdk/openai` (`createOpenAI({ baseURL }).chat(model)`) against Ollama's OpenAI-compatible `OLLAMA_BASE_URL` (default `http://localhost:11434/v1`); model from `OLLAMA_MODEL`.
- Website, in `features/template/sync/copilot/`:
  - `TemplateCopilot.tsx` — `<CopilotKitProvider>` wrapper (`NEXT_PUBLIC_COPILOT_URL`, default `http://localhost:3030/copilotkit`), edit mode only; used by `TemplateBuilder`.
  - `WidgetCopilotFunctions.tsx` — widget functions: `useAgentContext` (widgets, widget types) and `useFrontendTool` (zod parameters) for `addWidget`, `removeWidget`, `setWidgetProperty` (only `label`/`placeholder`/`required`, the scalar properties) built on `useWidgetActions`.
  - `TemplateCopilotPopup.tsx` — chat popup.
- Run: `docker compose up ollama -d && docker/ollama/pull-model.sh`, then `pnpm --filter @tomato-form/copilot-server dev`.
- Not verified: nothing was run, linted or type-checked (project rule). The v2 migration was written from the installed `.d.cts` types only.
- Switched the model from Ollama to Google Gemini. `@google/genai` is not pluggable into CopilotKit's `BuiltInAgent` (it takes an AI SDK model), so the agent uses `@ai-sdk/google` (`createGoogleGenerativeAI({ apiKey }) (model)`), which calls the same Gemini API. Env: `GEMINI_AI_KEY` (required), `GEMINI_MODEL` (default `gemini-2.5-flash`); `@ai-sdk/openai` and `OLLAMA_*` were removed from `copilot-server`. The Ollama docker service / `pull-model.sh` are no longer used by the server.
- Every request sent to the LLM is logged by `loggingFetch` (`copilot/llm-request-logger.ts`: method, url, body, response status and latency; headers, so the API key, are not logged). Toggle with `LLM_LOG_REQUESTS` (default `true`).
- Run: `pnpm --filter @tomato-form/copilot-server dev` (set `GEMINI_AI_KEY` in `copilot-server/.env`).
