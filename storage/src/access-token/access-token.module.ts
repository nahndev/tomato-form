import { Module } from "@nestjs/common";
import { AccessTokenController } from "./access-token.controller";
import { AccessTokenService } from "./access-token.service";

@Module({
  controllers: [AccessTokenController],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
