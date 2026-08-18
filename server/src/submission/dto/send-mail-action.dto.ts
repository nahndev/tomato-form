import { ApiProperty } from "@nestjs/swagger";
import { RecipientType } from "@/job/action/send-mail/send-mail-action.types";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

export class SendMailRecipientDto {
  @ApiProperty({ enum: RecipientType })
  @IsEnum(RecipientType)
  type!: RecipientType;

  @ApiProperty({ example: "jane@example.com or a user uuid" })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class SendMailActionDto {
  @ApiProperty({ type: [SendMailRecipientDto] })
  @ValidateNested({ each: true })
  @Type(() => SendMailRecipientDto)
  @ArrayMinSize(1)
  recipients!: SendMailRecipientDto[];

  @ApiProperty({ example: "Welcome to Tomato Form" })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ example: "Thanks for submitting!" })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
