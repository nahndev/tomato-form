import { Module } from "@nestjs/common";
import { AccessTokenModule } from "@/access-token/access-token.module";
import { FileModule } from "@/file/file.module";
import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
  imports: [FileModule, AccessTokenModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
