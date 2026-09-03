import { AccessToken } from "@/database/prisma-client";
import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  token!: string;

  @ApiProperty()
  folderId!: string;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  static fromEntity(accessToken: AccessToken): AccessTokenResponseDto {
    const dto = new AccessTokenResponseDto();
    dto.id = accessToken.id;
    dto.token = accessToken.token;
    dto.folderId = accessToken.folderId;
    dto.expiresAt = accessToken.expiresAt;
    dto.createdAt = accessToken.createdAt;
    return dto;
  }
}
