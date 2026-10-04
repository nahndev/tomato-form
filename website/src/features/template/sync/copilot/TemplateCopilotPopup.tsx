"use client";

import { CopilotPopup } from "@copilotkit/react-core/v2";

/** Chat popup for the template builder; the tools it can call live in `WidgetCopilotFunctions`. */
export const TemplateCopilotPopup: React.FC = () => (
  <CopilotPopup
    labels={{
      modalHeaderTitle: "Template assistant",
      welcomeMessageText: "Tell me which widgets to add, remove or change.",
    }}
  />
);
