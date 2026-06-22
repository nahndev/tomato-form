import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { IsCronExpression } from "../../common/decorators/is-cron-expression.decorator";
import { ActionType } from "../schemas/action.schema";

export class CreateActionDto {
  @ApiProperty({ enum: [ActionType.SUBMISSION_CREATION] })
  @IsIn([ActionType.SUBMISSION_CREATION])
  type!: ActionType;

  @ApiProperty({ example: "b3f1c2..." })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiProperty({ example: "f7e9a1..." })
  @IsString()
  @IsNotEmpty()
  boardId!: string;
}

export class CreateJobDto {
  @ApiProperty({ example: "Daily feedback submission" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: "0 9 * * *",
    description: "Standard 5-field cron expression",
  })
  @IsString()
  @IsNotEmpty()
  @IsCronExpression()
  expression!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @ApiProperty({ type: [CreateActionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto)
  @ArrayMinSize(1)
  actions!: CreateActionDto[];
}
