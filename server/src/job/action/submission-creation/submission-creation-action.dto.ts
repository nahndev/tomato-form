import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { ActionType } from "../base-action.schema";

export class CreateSubmissionCreationActionDto {
  @ApiProperty({ enum: [ActionType.SUBMISSION_CREATION] })
  @IsIn([ActionType.SUBMISSION_CREATION])
  type!: ActionType.SUBMISSION_CREATION;

  @ApiProperty({ example: "b3f1c2..." })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiProperty({ example: "f7e9a1..." })
  @IsString()
  @IsNotEmpty()
  boardId!: string;
}
