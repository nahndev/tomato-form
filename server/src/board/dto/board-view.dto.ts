import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { IsItemKeyMapConstraint } from "./board-column.dto";

/**
 * Values must stay in sync with `BoardViewType` in
 * `website/src/types/board-view.ts` — there is no shared-types package
 * between web and server in this monorepo, so this is a hand mirror.
 * Only "chart" is fully configurable today; "calendar"/"dashboard" are
 * reserved placeholders per the ticket's "extend later" scope.
 */
export const BoardViewTypeDto = {
  CHART: "chart",
  CALENDAR: "calendar",
  DASHBOARD: "dashboard",
} as const;
export type BoardViewTypeDto = (typeof BoardViewTypeDto)[keyof typeof BoardViewTypeDto];

export const ChartAggregationDto = {
  COUNT: "count",
  SUM: "sum",
  AVG: "avg",
} as const;
export type ChartAggregationDto = (typeof ChartAggregationDto)[keyof typeof ChartAggregationDto];

export const ChartKindDto = {
  BAR: "bar",
  LINE: "line",
  PIE: "pie",
} as const;
export type ChartKindDto = (typeof ChartKindDto)[keyof typeof ChartKindDto];

/**
 * Validates `BoardChartViewConfig` shape for `type: "chart"`, and requires
 * `valueField` specifically when `aggregation` is not "count". Placeholder
 * config for "calendar"/"dashboard" (an empty object) is always accepted,
 * since those view types have no settings UI yet.
 */
@ValidatorConstraint({ name: "isBoardViewConfig", async: false })
class IsBoardViewConfigConstraint implements ValidatorConstraintInterface {
  private itemsValidator = new IsItemKeyMapConstraint();

  validate(value: unknown, args: ValidationArguments): boolean {
    const type = (args.object as Record<string, unknown>).type;
    if (type !== BoardViewTypeDto.CHART) {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const config = value as Record<string, unknown>;

    if (!this.itemsValidator.validate(config.groupBy)) return false;
    if (Object.keys(config.groupBy as Record<string, unknown>).length === 0) return false;

    const aggregation = config.aggregation;
    if (!Object.values(ChartAggregationDto).includes(aggregation as ChartAggregationDto))
      return false;

    const chartKind = config.chartKind;
    if (!Object.values(ChartKindDto).includes(chartKind as ChartKindDto)) return false;

    if (aggregation !== ChartAggregationDto.COUNT) {
      if (config.valueField === undefined) return false;
      if (!this.itemsValidator.validate(config.valueField)) return false;
      if (Object.keys(config.valueField as Record<string, unknown>).length === 0) return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid config for the view's type`;
  }
}

export class BoardViewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: "Submissions by status" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: BoardViewTypeDto })
  @IsEnum(BoardViewTypeDto)
  type!: BoardViewTypeDto;

  @ApiProperty({
    description:
      "View-type-specific configuration. For type=\"chart\": group-by field(s) (templateId -> \"widgetId:property\"), aggregation, optional value field (required unless aggregation is \"count\"), and chart kind. For \"calendar\"/\"dashboard\" (not yet configurable), an empty object.",
    type: "object",
    additionalProperties: true,
    example: {
      groupBy: { "template-1": "widget-1:default" },
      aggregation: "count",
      chartKind: "bar",
    },
  })
  @Validate(IsBoardViewConfigConstraint)
  config!: Record<string, unknown>;
}
