import { ApiProperty } from "@nestjs/swagger";
import { ActionType } from "@/database/prisma-client";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateSubmissionCreationActionDto {
  @ApiProperty({ enum: [ActionType.SUBMISSION_CREATION] })
  @IsIn([ActionType.SUBMISSION_CREATION])
  type!: typeof ActionType.SUBMISSION_CREATION;

  @ApiProperty({ example: "b3f1c2..." })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiProperty({ example: "f7e9a1..." })
  @IsString()
  @IsNotEmpty()
  boardId!: string;
}
