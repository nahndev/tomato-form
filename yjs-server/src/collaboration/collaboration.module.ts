import { Module } from "@nestjs/common";
import { CollaborationService } from "@/collaboration/collaboration.service";

@Module({
  providers: [CollaborationService],
})
export class CollaborationModule {}
