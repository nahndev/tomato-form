import { Module } from "@nestjs/common";
import { JobModule } from "../job/job.module";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";

@Module({
  imports: [JobModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
