import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Jane Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "jane@example.com", nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string | null;
}
