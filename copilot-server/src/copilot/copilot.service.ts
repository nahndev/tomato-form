import { EnvironmentVariables } from "@/config/env.schema";
import { loggingFetch } from "@/copilot/llm-request-logger";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { BuiltInAgent, CopilotRuntime } from "@copilotkit/runtime/v2";
import type { CopilotExpressRouter } from "@copilotkit/runtime/v2/express";
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const COPILOT_ENDPOINT = "/copilotkit";

/** Agent id the CopilotKit v2 frontend binds to when none is given. */
const DEFAULT_AGENT_ID = "default";

const AGENT_PROMPT =
  "You help the user build a form template. You can add and remove widgets and change a widget's label, placeholder or required flag. " +
  "Use the available tools to change the template - never claim a change you did not make through a tool. " +
  "Refer to widgets by their label and look up their id from the template widgets context.";

/**
 * Owns the CopilotKit v2 runtime. The agent talks to Google Gemini through the
 * AI SDK Google provider, the model CopilotKit's `BuiltInAgent` consumes.
 */
@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  readonly router: CopilotExpressRouter;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    const apiKey = config.get("GEMINI_AI_KEY", { infer: true });
    const modelName = config.get("GEMINI_MODEL", { infer: true });
    const origins = config.get("CORS_ORIGIN", { infer: true }).split(",");
    const logRequests =
      config.get("LLM_LOG_REQUESTS", { infer: true }) === "true";

    const google = createGoogleGenerativeAI({
      apiKey,
      ...(logRequests && { fetch: loggingFetch }),
    });
    const runtime = new CopilotRuntime({
      agents: {
        [DEFAULT_AGENT_ID]: new BuiltInAgent({
          model: google(modelName),
          prompt: AGENT_PROMPT,
        }),
      },
    });

    this.router = createCopilotExpressHandler({
      runtime,
      basePath: COPILOT_ENDPOINT,
      cors: { origin: origins },
    });
    this.logger.log(`CopilotKit runtime -> Gemini (model: ${modelName})`);
  }
}
