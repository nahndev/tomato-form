import { Module } from "@nestjs/common";
import { CopilotService } from "@/copilot/copilot.service";

@Module({
  providers: [CopilotService],
  exports: [CopilotService],
})
export class CopilotModule {}
