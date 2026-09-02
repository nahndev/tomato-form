import { Module } from "@nestjs/common";
import { FileModule } from "@/file/file.module";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
  imports: [FileModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
