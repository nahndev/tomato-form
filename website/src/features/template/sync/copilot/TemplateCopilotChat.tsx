"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * Chat body of the "Assistant" toolbar tab. It only fills the panel; the header,
 * docked/popup mode and tab strip come from `ToolbarPanel` like every other menu.
 * The tools it can call live in `WidgetCopilotFunctions`.
 */
export const TemplateCopilotChat: React.FC = () => (
  <div className="h-full overflow-hidden">
    <CopilotChat
      className="h-full"
      labels={{
        welcomeMessageText: "Tell me which widgets to add, remove or change.",
      }}
    />
  </div>
);
