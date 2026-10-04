"use client";

import { useTemplateMode } from "@/features/template/components/provider/TemplateBuilderProvider";
import { TemplateMode } from "@/types/template";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { toast } from "sonner";
import { SessionCopilotFunctions } from "./SessionCopilotFunctions";
import { TemplateCopilotContext } from "./TemplateCopilotContext";
import { WidgetCopilotFunctions } from "./WidgetCopilotFunctions";

/** Proxied to copilot-server by the `/copilotkit` rewrite in `next.config.ts`. */
const COPILOT_RUNTIME_URL = "/copilotkit";

interface TemplateCopilotProps {
  children: React.ReactNode;
}

/**
 * Wraps the builder in the CopilotKit v2 provider and mounts the widget
 * and session functions beside it; the chat itself is the "Assistant" `ToolbarPanel` tab.
 * Only active while editing - in view mode the copilot must not be able to
 * change the template, so children render bare.
 */
const TemplateCopilot: React.FC<TemplateCopilotProps> = ({ children }) => {
  const mode = useTemplateMode();
  if (mode !== TemplateMode.EDIT) return <>{children}</>;

  return (
    <CopilotKitProvider
      runtimeUrl={COPILOT_RUNTIME_URL}
      enableInspector={false}
      onError={(event) => {
        console.error("Copilot error", {
          code: event.code,
          message: event.error?.message,
          context: event.context,
        });
        toast.error(
          `The copilot failed${event.error?.message ? `: ${event.error.message}` : ""}. Check that copilot-server and ollama are running.`,
        );
      }}
    >
      <TemplateCopilotContext />
      <WidgetCopilotFunctions />
      <SessionCopilotFunctions />
      {children}
    </CopilotKitProvider>
  );
};

export default TemplateCopilot;
