import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateAccessTokenDto {
  @ApiProperty({ description: "Folder the token grants upload access to" })
  @IsUUID()
  @IsNotEmpty()
  folderId!: string;
}
