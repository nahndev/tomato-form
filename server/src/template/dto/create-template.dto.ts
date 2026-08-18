import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateTemplateDto {
  @ApiProperty({ example: "My Form" })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
