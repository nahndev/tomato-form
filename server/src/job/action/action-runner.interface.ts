import { Action } from "./base-action.schema";

export interface ActionRunContext {
  results: Record<string, unknown>[];
}

export interface ActionRunnerHandler<TAction extends Action = Action> {
  run(
    action: TAction,
    context: ActionRunContext,
  ): Promise<Record<string, unknown>>;
}
