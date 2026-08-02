import { Action } from "@/database/prisma-client";

export interface ActionRunContext {
  results: Record<string, unknown>[];
}

export interface ActionRunnerHandler {
  run(action: Action, context: ActionRunContext): Promise<Record<string, unknown>>;
}
