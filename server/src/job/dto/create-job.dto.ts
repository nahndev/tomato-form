import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { IsCronExpression } from "../../common/decorators/is-cron-expression.decorator";
import { ActionType } from "../action/base-action.schema";
import { CreateSubmissionCreationActionDto } from "../action/submission-creation/submission-creation-action.dto";
import { CreateSendMailActionDto } from "../action/send-mail/send-mail-action.dto";

export class CreateActionDto {
  @ApiProperty({ enum: ActionType })
  type!: ActionType;
}

export type CreateJobActionDto =
  | CreateSubmissionCreationActionDto
  | CreateSendMailActionDto;

@ApiExtraModels(CreateSubmissionCreationActionDto, CreateSendMailActionDto)
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

  @ApiProperty({
    type: "array",
    items: {
      oneOf: [
        { $ref: getSchemaPath(CreateSubmissionCreationActionDto) },
        { $ref: getSchemaPath(CreateSendMailActionDto) },
      ],
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateActionDto, {
    discriminator: {
      property: "type",
      subTypes: [
        {
          value: CreateSubmissionCreationActionDto,
          name: ActionType.SUBMISSION_CREATION,
        },
        { value: CreateSendMailActionDto, name: ActionType.SEND_MAIL },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ArrayMinSize(1)
  actions!: CreateJobActionDto[];
}
