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
 * `date`/`time` sub-views vs its `default` full value) — mirrors `ValueProperty`
 * in `website/src/features/template/constants/widget/valueProperties.ts`.
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
 * Column items are stored as `widgetId:property` compound keys - widgetId and
 * property are always picked together and never change independently, so
 * there's no need to model them as a separate object.
 */
@ValidatorConstraint({ name: "isBoardColumnItems", async: false })
export class IsBoardColumnItemsConstraint implements ValidatorConstraintInterface {
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

@ApiExtraModels(ColumnWidthDto, ColumnFlexDto)
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
    description: "Map of templateId to a \"widgetId:property\" string - the widget + value-property picked from that template",
    type: "object",
    additionalProperties: { type: "string" },
    example: { "template-1": "widget-1:default" },
  })
  @Validate(IsBoardColumnItemsConstraint)
  items!: Record<string, string>;
}
