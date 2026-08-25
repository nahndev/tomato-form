import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockBoard } from "@/features/board/testing/board.factory";
import {
  getMockTemplate,
  getMockTemplateVersion,
  getMockWidget,
} from "@/features/template/testing/template.factory";
import { WidgetType } from "@/types/widget";
import BoardColumnsSetting from "./BoardColumnsSetting";

jest.mock("@/features/board/components/provider/BoardProvider");
jest.mock("@/features/board/hooks/useBoards");
jest.mock("@/components/ui/sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const { useBoardContext } = jest.requireMock(
  "@/features/board/components/provider/BoardProvider",
);
const { useUpdateBoard } = jest.requireMock("@/features/board/hooks/useBoards");
const { toast } = jest.requireMock("@/components/ui/sonner");

const widget = getMockWidget({ type: WidgetType.TEXT, label: "Full Name" });
const templateVersion = getMockTemplateVersion({
  snapshot: {
    widgets: { [widget.id]: widget },
    layouts: {},
    widgetToSession: {},
    sessions: {},
  },
});
const template = getMockTemplate({
  name: "Feedback",
  templateVersions: [templateVersion],
});

function setupBoard(overrides?: Parameters<typeof getMockBoard>[0]) {
  const board = getMockBoard({ templates: [template], columns: [], ...overrides });
  useBoardContext.mockReturnValue(board);
  return board;
}

describe("BoardColumnsSetting", () => {
  const mutateAsync = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mutateAsync.mockResolvedValue(undefined);
    useUpdateBoard.mockReturnValue({ mutateAsync, isPending: false });
  });

  it("shows an empty-templates message when the board has no linked templates", () => {
    setupBoard({ templates: [] });
    render(<BoardColumnsSetting />);
    expect(
      screen.getByText(/link a template on the template tab/i),
    ).toBeInTheDocument();
  });

  it("disables the save button while a save is pending", () => {
    setupBoard();
    useUpdateBoard.mockReturnValue({ mutateAsync, isPending: true });
    render(<BoardColumnsSetting />);
    expect(screen.getByLabelText("Save columns")).toBeDisabled();
  });

  it("drops an empty, never-touched column on save", async () => {
    const user = userEvent.setup();
    setupBoard();
    render(<BoardColumnsSetting />);

    await user.click(screen.getByRole("button", { name: /add column/i }));
    await user.click(screen.getByLabelText("Save columns"));

    expect(mutateAsync).toHaveBeenCalledWith({ columns: [] });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("blocks save and shows an error when a touched column is missing its size", async () => {
    const user = userEvent.setup();
    setupBoard();
    render(<BoardColumnsSetting />);

    await user.click(screen.getByRole("button", { name: /add column/i }));
    await user.selectOptions(
      screen.getByLabelText("Widget for Feedback"),
      widget.id,
    );
    await user.clear(screen.getByLabelText("Column size"));
    await user.click(screen.getByLabelText("Save columns"));

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("saves a fully-configured column with its picked widget", async () => {
    const user = userEvent.setup();
    setupBoard();
    render(<BoardColumnsSetting />);

    await user.click(screen.getByRole("button", { name: /add column/i }));
    await user.selectOptions(
      screen.getByLabelText("Widget for Feedback"),
      widget.id,
    );
    await user.click(screen.getByLabelText("Save columns"));

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    const [{ columns }] = mutateAsync.mock.calls[0];
    expect(columns).toHaveLength(1);
    expect(columns[0]).toMatchObject({
      type: "text",
      items: [{ templateId: template.id, widgetId: widget.id }],
    });
    expect(columns[0].size).toBe(150);
    expect(toast.success).toHaveBeenCalled();
  });
});
