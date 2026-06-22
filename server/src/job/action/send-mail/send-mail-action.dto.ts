import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";
import { ActionType } from "../base-action.schema";
import { RecipientType } from "./send-mail-action.schema";

export class CreateRecipientDto {
  @ApiProperty({ enum: RecipientType })
  @IsEnum(RecipientType)
  type!: RecipientType;

  @ApiProperty({ example: "jane@example.com or a user uuid" })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class CreateMailContentDto {
  @ApiProperty({ example: "Welcome to Tomato Form" })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ example: "Thanks for signing up!" })
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class CreateSendMailActionDto {
  @ApiProperty({ enum: [ActionType.SEND_MAIL] })
  @IsIn([ActionType.SEND_MAIL])
  type!: ActionType.SEND_MAIL;

  @ApiProperty({ type: [CreateRecipientDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipientDto)
  @ArrayMinSize(1)
  recipients!: CreateRecipientDto[];

  @ApiProperty({ type: CreateMailContentDto })
  @ValidateNested()
  @Type(() => CreateMailContentDto)
  content!: CreateMailContentDto;
}
