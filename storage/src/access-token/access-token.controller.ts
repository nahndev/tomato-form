import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenService } from "./access-token.service";
import { AccessTokenResponseDto } from "./dto/access-token-response.dto";
import { CreateAccessTokenDto } from "./dto/create-access-token.dto";
import { ListAccessTokensQueryDto } from "./dto/list-access-tokens-query.dto";

@ApiTags("Access Tokens")
@Controller("access-tokens")
export class AccessTokenController {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  @Post()
  @ApiOperation({ summary: "Issue an access token scoped to uploading files into one folder" })
  @ApiCreatedResponse({ type: AccessTokenResponseDto, description: "Access token issued" })
  @ApiResponse({ status: 400, description: "Target resource is not a folder" })
  @ApiResponse({ status: 404, description: "Folder not found" })
  async issue(@Body() dto: CreateAccessTokenDto): Promise<AccessTokenResponseDto> {
    const accessToken = await this.accessTokenService.issue(dto.folderId);
    return AccessTokenResponseDto.fromEntity(accessToken);
  }

  @Get()
  @ApiOperation({ summary: "List issued access tokens, optionally filtered by folder" })
  @ApiOkResponse({ type: [AccessTokenResponseDto] })
  async findAll(@Query() query: ListAccessTokensQueryDto): Promise<AccessTokenResponseDto[]> {
    const accessTokens = await this.accessTokenService.findAll(query.folderId);
    return accessTokens.map((accessToken) => AccessTokenResponseDto.fromEntity(accessToken));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an access token" })
  @ApiParam({ name: "id", description: "Access token id" })
  @ApiOkResponse({ type: AccessTokenResponseDto })
  @ApiResponse({ status: 404, description: "Access token not found" })
  async findOne(@Param("id") id: string): Promise<AccessTokenResponseDto> {
    const accessToken = await this.accessTokenService.findOne(id);
    return AccessTokenResponseDto.fromEntity(accessToken);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke an access token" })
  @ApiParam({ name: "id", description: "Access token id" })
  @ApiNoContentResponse({ description: "Access token revoked" })
  @ApiResponse({ status: 404, description: "Access token not found" })
  async revoke(@Param("id") id: string): Promise<void> {
    await this.accessTokenService.revoke(id);
  }
}
