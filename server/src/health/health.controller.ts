import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse } from "@nestjs/swagger";

class HealthResponseDto {
  status: string;
  timestamp: string;
}

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({ type: HealthResponseDto, description: "API is healthy" })
  @Get()
  check(): HealthResponseDto {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
