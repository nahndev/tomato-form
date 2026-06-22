import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MailService } from "../mail/mail.service";

class HealthResponseDto {
  status!: string;
  timestamp!: string;
}

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({ type: HealthResponseDto, description: "API is healthy" })
  @Get()
  check(): HealthResponseDto {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @ApiOperation({ summary: "Mail service health check" })
  @ApiOkResponse({
    type: HealthResponseDto,
    description: "Mail service is reachable",
  })
  @ApiResponse({ status: 503, description: "Mail service is unreachable" })
  @Get("mail")
  async checkMail(): Promise<HealthResponseDto> {
    const isHealthy = await this.mailService.checkConnection();
    if (!isHealthy) {
      throw new ServiceUnavailableException("Mail service is unreachable");
    }
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
