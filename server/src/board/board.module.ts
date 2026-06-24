import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobModule } from "../job/job.module";
import { BoardHandler } from "./board.handler";
import { Board, BoardSchema } from "./board.schema";
import { BoardService } from "./board.service";
import { BoardController } from "./board.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    JobModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardHandler],
  exports: [BoardService],
})
export class BoardModule {}
