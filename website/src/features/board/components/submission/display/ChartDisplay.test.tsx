import {
  getMockBoardChartViewConfig,
  getMockBoardView,
  getMockSubmission,
} from "@/features/board/testing/board.factory";
import { ChartKind } from "@/types/board-view";
import { render, screen } from "@testing-library/react";
import ChartDisplay from "./ChartDisplay";

const GROUP_BY = { "template-1": "widget-1:default" };

describe("ChartDisplay", () => {
  it("shows an empty state when there is no data to chart", () => {
    const view = getMockBoardView({
      config: getMockBoardChartViewConfig({ groupBy: GROUP_BY }),
    });

    render(<ChartDisplay view={view} submissions={[]} />);

    expect(screen.getByText(/no data to chart/i)).toBeInTheDocument();
  });

  it("renders a bar chart without throwing when data is present", () => {
    const view = getMockBoardView({
      config: getMockBoardChartViewConfig({ groupBy: GROUP_BY, chartKind: ChartKind.BAR }),
    });
    const submissions = [
      getMockSubmission({
        templateId: "template-1",
        dataDisplays: { "widget-1": { default: { text: "Open" } } },
      }),
    ];

    const { container } = render(<ChartDisplay view={view} submissions={submissions} />);

    expect(screen.queryByText(/no data to chart/i)).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it("renders a pie chart without throwing when data is present", () => {
    const view = getMockBoardView({
      config: getMockBoardChartViewConfig({ groupBy: GROUP_BY, chartKind: ChartKind.PIE }),
    });
    const submissions = [
      getMockSubmission({
        templateId: "template-1",
        dataDisplays: { "widget-1": { default: { text: "Open" } } },
      }),
    ];

    const { container } = render(<ChartDisplay view={view} submissions={submissions} />);

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
