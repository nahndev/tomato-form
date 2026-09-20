import type { LinkAction } from "@/types/button-action";

/** Shared `link` action behavior - opening a URL is identical everywhere it runs. */
export function runLinkAction(action: LinkAction): void {
  window.open(action.url, "_blank", "noopener,noreferrer");
}
