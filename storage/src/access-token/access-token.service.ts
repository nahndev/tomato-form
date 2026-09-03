import { randomBytes } from "node:crypto";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccessToken } from "@/database/prisma-client";
import { PrismaService } from "@/database/prisma.service";
import { ACCESS_TOKEN_TTL_MS } from "./access-token.constants";

@Injectable()
export class AccessTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async issue(folderId: string): Promise<AccessToken> {
    await this.assertFolder(folderId);

    return this.prisma.accessToken.create({
      data: {
        folderId,
        token: randomBytes(32).toString("hex"),
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS),
      },
    });
  }

  async findAll(folderId?: string): Promise<AccessToken[]> {
    return this.prisma.accessToken.findMany({
      where: folderId ? { folderId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<AccessToken> {
    const accessToken = await this.prisma.accessToken.findUnique({ where: { id } });
    if (!accessToken) throw new NotFoundException(`Access token ${id} not found`);
    return accessToken;
  }

  async revoke(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.accessToken.delete({ where: { id } });
  }

  async validateForFolder(rawToken: string | undefined, folderId?: string): Promise<void> {
    if (!rawToken) return;

    const accessToken = await this.prisma.accessToken.findUnique({ where: { token: rawToken } });
    if (!accessToken) throw new UnauthorizedException("Invalid access token");
    if (accessToken.expiresAt < new Date()) throw new UnauthorizedException("Access token expired");
    if (accessToken.folderId !== folderId) {
      throw new UnauthorizedException("Access token is not valid for this folder");
    }
  }

  private async assertFolder(folderId: string): Promise<void> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: folderId },
      include: { folder: true },
    });
    if (!resource) throw new NotFoundException(`Resource ${folderId} not found`);
    if (!resource.folder) throw new BadRequestException(`Resource ${folderId} is not a folder`);
  }
}
