import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../database/prisma.service";

class HealthResponseDto {
  status!: string;
  timestamp!: string;
}

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({ type: HealthResponseDto, description: "API is healthy" })
  @Get()
  check(): HealthResponseDto {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @ApiOperation({ summary: "Database health check" })
  @ApiOkResponse({
    type: HealthResponseDto,
    description: "Database is reachable",
  })
  @ApiResponse({ status: 503, description: "Database is unreachable" })
  @Get("db")
  async checkDb(): Promise<HealthResponseDto> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException("Database is unreachable");
    }
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
