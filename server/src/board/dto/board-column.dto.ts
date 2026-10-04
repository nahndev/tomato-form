import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

/** A column's rendered width: a fixed pixel width, or a flex share of the row. */
export class ColumnWidthDto {
  @ApiProperty({ example: 100, minimum: 1 })
  width!: number;
}

export class ColumnFlexDto {
  @ApiProperty({ example: 2, minimum: 1 })
  flex!: number;
}

@ValidatorConstraint({ name: "isColumnSize", async: false })
class IsColumnSizeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "object" || value === null) return false;

    const keys = Object.keys(value);
    if (keys.length !== 1) return false;

    const [key] = keys;
    if (key !== "width" && key !== "flex") return false;

    const num = (value as Record<string, unknown>)[key];
    return typeof num === "number" && Number.isInteger(num) && num >= 1;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be exactly one of { width: number } or { flex: number }, each a positive integer`;
  }
}

/**
 * Values must stay in sync with `DisplayType` in
 * `website/src/types/display-type.ts` — there is no shared-types package
 * between web and server in this monorepo, so this is a hand mirror.
 */
export const BoardColumnDisplayTypeDto = {
  TEXT: "text",
  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",
  NUMBER: "number",
} as const;
export type BoardColumnDisplayTypeDto =
  (typeof BoardColumnDisplayTypeDto)[keyof typeof BoardColumnDisplayTypeDto];

/**
 * Which value-property of a widget a column item targets (e.g. `datetime`'s
 * `date`/`time` sub-views vs its `default` full value) — mirrors `ValueType`
 * in `website/src/features/board/constants/column/valueTypes.ts`.
 */
export const ValuePropertyDto = {
  DEFAULT: "default",
  DATE: "date",
  TIME: "time",
} as const;
export type ValuePropertyDto =
  (typeof ValuePropertyDto)[keyof typeof ValuePropertyDto];

const VALUE_PROPERTY_DTO_VALUES: readonly string[] = Object.values(ValuePropertyDto);

/**
 * Validates a map of templateId -> `widgetId:property` compound key. This is
 * the addressing scheme `BoardChartViewConfig.groupBy`/`valueField` mirror
 * independently of `BoardColumnDto.items` (see board-view.dto.ts) - it's kept
 * separate from `IsBoardColumnItemsConstraint` below, which validates the
 * `{ widgetId, property }` object shape `BoardColumnDto.items` actually uses.
 */
@ValidatorConstraint({ name: "isItemKeyMap", async: false })
export class IsItemKeyMapConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "object" || value === null || Array.isArray(value))
      return false;

    return Object.entries(value as Record<string, unknown>).every(
      ([templateId, itemKey]) => {
        if (templateId.length === 0 || typeof itemKey !== "string") return false;

        const parts = itemKey.split(":");
        if (parts.length !== 2) return false;

        const [widgetId, property] = parts;
        return widgetId.length > 0 && VALUE_PROPERTY_DTO_VALUES.includes(property);
      },
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be an object mapping templateId to a "widgetId:property" string`;
  }
}

export class BoardColumnItemDto {
  @ApiProperty({ example: "widget-1" })
  widgetId!: string;

  @ApiProperty({ enum: ValuePropertyDto })
  property!: ValuePropertyDto;
}

/**
 * Column items map templateId to the `{ widgetId, property }` widget picked
 * from that template - widgetId and property are always picked together and
 * never change independently, so they're one nested object rather than two
 * separately-editable fields.
 */
@ValidatorConstraint({ name: "isBoardColumnItems", async: false })
export class IsBoardColumnItemsConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "object" || value === null || Array.isArray(value))
      return false;

    return Object.entries(value as Record<string, unknown>).every(
      ([templateId, item]) => {
        if (templateId.length === 0) return false;
        if (typeof item !== "object" || item === null || Array.isArray(item))
          return false;

        const entry = item as Record<string, unknown>;
        if (Object.keys(entry).length !== 2) return false;

        const { widgetId, property } = entry;
        return (
          typeof widgetId === "string" &&
          widgetId.length > 0 &&
          typeof property === "string" &&
          VALUE_PROPERTY_DTO_VALUES.includes(property)
        );
      },
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be an object mapping templateId to { widgetId, property }`;
  }
}

@ApiExtraModels(ColumnWidthDto, ColumnFlexDto, BoardColumnItemDto)
export class BoardColumnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ enum: BoardColumnDisplayTypeDto })
  @IsEnum(BoardColumnDisplayTypeDto)
  type!: BoardColumnDisplayTypeDto;

  @ApiProperty({
    description: "A fixed pixel width, or a flex share of the row",
    oneOf: [
      { $ref: getSchemaPath(ColumnWidthDto) },
      { $ref: getSchemaPath(ColumnFlexDto) },
    ],
  })
  @Validate(IsColumnSizeConstraint)
  size!: ColumnWidthDto | ColumnFlexDto;

  @ApiPropertyOptional({ nullable: true, example: "Assignee" })
  @IsOptional()
  @IsString()
  label?: string | null;

  @ApiProperty({
    description: "Map of templateId to { widgetId, property } - the widget + value-property picked from that template",
    type: "object",
    additionalProperties: { $ref: getSchemaPath(BoardColumnItemDto) },
    example: { "template-1": { widgetId: "widget-1", property: "default" } },
  })
  @Validate(IsBoardColumnItemsConstraint)
  items!: Record<string, BoardColumnItemDto>;
}
