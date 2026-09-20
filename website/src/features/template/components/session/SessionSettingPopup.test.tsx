import type { TemplateState } from "@/features/template/hooks/internal/templateStateReader";
import { TemplateStateContext } from "@/features/template/hooks/state/useTemplateState";
import { getMockSession } from "@/features/template/testing/template.factory";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "./SessionProvider";
import SessionSettingPopup from "./SessionSettingPopup";

const removeSession = jest.fn();
const updateSession = jest.fn();

jest.mock("@/features/template/sync/hooks/useSessionActions", () => ({
  useSessionActions: () => ({
    updateSession,
    removeSession,
    addSession: jest.fn(),
    updateLayout: jest.fn(),
  }),
}));

function renderPopup(sessions: TemplateState["sessions"], sessionId: string) {
  const state: TemplateState = {
    name: "Template",
    widgets: {},
    layouts: {},
    widgetToSession: {},
    sessions,
    isPublishing: false,
  };

  render(
    <TemplateStateContext.Provider value={state}>
      <SessionProvider sessionId={sessionId}>
        <SessionSettingPopup />
      </SessionProvider>
    </TemplateStateContext.Provider>,
  );
}

async function openSettings() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /session settings/i }));
  return user;
}

describe("SessionSettingPopup - remove session", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables the remove button when it is the only session", async () => {
    const session = getMockSession({ id: "s1" });
    renderPopup({ s1: session }, "s1");

    await openSettings();

    expect(
      screen.getByRole("button", { name: /remove session/i }),
    ).toBeDisabled();
  });

  it("enables the remove button when other sessions exist", async () => {
    const s1 = getMockSession({ id: "s1" });
    const s2 = getMockSession({ id: "s2" });
    renderPopup({ s1, s2 }, "s2");

    await openSettings();

    expect(
      screen.getByRole("button", { name: /remove session/i }),
    ).toBeEnabled();
  });

  it("does not remove the session until the confirmation dialog is accepted", async () => {
    const s1 = getMockSession({ id: "s1" });
    const s2 = getMockSession({ id: "s2" });
    renderPopup({ s1, s2 }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));

    expect(removeSession).not.toHaveBeenCalled();
    expect(
      screen.getByRole("alertdialog", { name: /remove this session/i }),
    ).toBeInTheDocument();
  });

  it("removes the session once the destructive action is confirmed", async () => {
    const s1 = getMockSession({ id: "s1" });
    const s2 = getMockSession({ id: "s2" });
    renderPopup({ s1, s2 }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));
    const dialog = screen.getByRole("alertdialog", {
      name: /remove this session/i,
    });
    await user.click(
      within(dialog).getByRole("button", { name: /remove session/i }),
    );

    expect(removeSession).toHaveBeenCalledWith("s2");
  });

  it("does not remove the session when the confirmation is cancelled", async () => {
    const s1 = getMockSession({ id: "s1" });
    const s2 = getMockSession({ id: "s2" });
    renderPopup({ s1, s2 }, "s2");
    const user = await openSettings();

    await user.click(screen.getByRole("button", { name: /remove session/i }));
    const dialog = screen.getByRole("alertdialog", {
      name: /remove this session/i,
    });
    await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(removeSession).not.toHaveBeenCalled();
  });
});
