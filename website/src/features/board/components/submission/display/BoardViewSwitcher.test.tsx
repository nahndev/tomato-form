import { getMockBoardView } from "@/features/board/testing/board.factory";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardViewSwitcher, { TABLE_VIEW_ID } from "./BoardViewSwitcher";

describe("BoardViewSwitcher", () => {
  it("renders nothing when the board has no views", () => {
    const { container } = render(
      <BoardViewSwitcher views={[]} activeViewId={TABLE_VIEW_ID} onChange={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows Table selected by default alongside each view", () => {
    const view = getMockBoardView({ name: "By status" });
    render(
      <BoardViewSwitcher views={[view]} activeViewId={TABLE_VIEW_ID} onChange={jest.fn()} />,
    );

    expect(screen.getByRole("radio", { name: /table view/i })).toHaveAttribute(
      "data-state",
      "on",
    );
    expect(screen.getByRole("radio", { name: /by status view/i })).toHaveAttribute(
      "data-state",
      "off",
    );
  });

  it("calls onChange with the clicked view's id", async () => {
    const user = userEvent.setup();
    const view = getMockBoardView({ id: "view-1", name: "By status" });
    const onChange = jest.fn();
    render(
      <BoardViewSwitcher views={[view]} activeViewId={TABLE_VIEW_ID} onChange={onChange} />,
    );

    await user.click(screen.getByRole("radio", { name: /by status view/i }));

    expect(onChange).toHaveBeenCalledWith("view-1");
  });
});
