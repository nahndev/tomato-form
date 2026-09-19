import { OptionsDescriptor } from "@/features/template/components/property/descriptors/OptionsDescriptor";
import { getMockOption } from "@/features/template/testing/template.factory";
import { WidgetType } from "@/types/widget";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("OptionsDescriptor", () => {
  it("renders one row per option, in index order", () => {
    const options = [
      getMockOption({ key: "b", value: "Second", index: "b" }),
      getMockOption({ key: "a", value: "First", index: "a" }),
    ];

    render(
      <OptionsDescriptor
        widgetType={WidgetType.SELECT}
        value={options}
        onChange={jest.fn()}
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
      "First",
      "Second",
    ]);
  });

  it("editing an option's text keeps its key, so existing answers referencing it aren't orphaned", async () => {
    const user = userEvent.setup();
    const option = getMockOption({ key: "opt-1", value: "Old label" });
    const onChange = jest.fn();

    render(
      <OptionsDescriptor
        widgetType={WidgetType.SELECT}
        value={[option]}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("textbox"), "!");

    const next = onChange.mock.calls.at(-1)?.[0];
    expect(next).toHaveLength(1);
    expect(next[0].key).toBe("opt-1");
    expect(next[0].value).toBe("Old label!");
  });

  it("adds a new option with a fresh key after the last one", async () => {
    const user = userEvent.setup();
    const option = getMockOption({ key: "opt-1", value: "Only option" });
    const onChange = jest.fn();

    render(
      <OptionsDescriptor
        widgetType={WidgetType.SELECT}
        value={[option]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add option/i }));

    const next = onChange.mock.calls.at(-1)?.[0];
    expect(next).toHaveLength(2);
    expect(next[0].key).toBe("opt-1");
    expect(next[1].key).not.toBe("opt-1");
    expect(next[1].value).toBe("");
  });

  it("removes only the targeted option", async () => {
    const user = userEvent.setup();
    const options = [
      getMockOption({ key: "opt-1", value: "Keep", index: "a" }),
      getMockOption({ key: "opt-2", value: "Remove", index: "b" }),
    ];
    const onChange = jest.fn();

    render(
      <OptionsDescriptor
        widgetType={WidgetType.SELECT}
        value={options}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getAllByRole("button", { name: /remove option/i })[1],
    );

    const next = onChange.mock.calls.at(-1)?.[0];
    expect(next).toEqual([expect.objectContaining({ key: "opt-1" })]);
  });
});
