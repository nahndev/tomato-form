import { getMockBoard, getMockBoardView } from "@/features/board/testing/board.factory";
import { getMockTemplate } from "@/features/template/testing/template.factory";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartSettingPopup from "./ChartSettingPopup";

const mutateAsync = jest.fn().mockResolvedValue(undefined);

jest.mock("@/features/board/hooks/useBoards", () => ({
  useUpdateBoard: () => ({ mutateAsync, isPending: false }),
}));

jest.mock("@/features/board/components/display/select/TemplateWidgetSelect", () => ({
  __esModule: true,
  default: ({
    template,
    value,
    onChange,
  }: {
    template: { id: string; name: string };
    value: string | null;
    onChange: (itemKey: string | null) => void;
  }) => (
    <button
      type="button"
      aria-label={`pick widget for ${template.name}`}
      data-selected={value ?? ""}
      onClick={() => onChange("widget-1:default")}
    >
      pick widget for {template.name}
    </button>
  ),
}));

describe("ChartSettingPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderPopup(overrides?: { view?: ReturnType<typeof getMockBoardView> }) {
    const template = getMockTemplate({ id: "template-1", name: "Feedback" });
    const board = getMockBoard({ id: "board-1", templates: [template], views: [] });
    const onOpenChange = jest.fn();

    render(
      <ChartSettingPopup
        board={board}
        view={overrides?.view}
        open
        onOpenChange={onOpenChange}
      />,
    );

    return { board, onOpenChange };
  }

  it("disables submit until a name and a group-by field are set", async () => {
    renderPopup();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /create/i })).toBeDisabled(),
    );
  });

  it("creates a view with count aggregation once name and group-by are filled in", async () => {
    const user = userEvent.setup();
    const { board, onOpenChange } = renderPopup();

    await user.type(screen.getByLabelText(/name/i), "Submissions by status");
    await user.click(screen.getByRole("button", { name: /pick widget for feedback/i }));

    expect(screen.getByRole("button", { name: /create/i })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(mutateAsync).toHaveBeenCalledWith({
      views: [
        expect.objectContaining({
          name: "Submissions by status",
          type: "chart",
          config: expect.objectContaining({
            groupBy: { [board.templates[0].id]: "widget-1:default" },
            aggregation: "count",
            chartKind: "bar",
          }),
        }),
      ],
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("pre-fills the form from an existing view in edit mode", () => {
    const view = getMockBoardView({ name: "Existing view" });
    renderPopup({ view });

    expect(screen.getByLabelText(/name/i)).toHaveValue("Existing view");
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
