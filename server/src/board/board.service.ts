import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Board, BoardDocument } from "./board.schema";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<BoardDocument>,
  ) {}

  async create(dto: CreateBoardDto): Promise<Board> {
    const doc = new this.boardModel({
      id: uuidv4(),
      name: dto.name,
      templateIds: dto.templateIds ?? [],
    });
    return doc.save();
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async findOne(id: string): Promise<Board> {
    const doc = await this.boardModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Board ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    const doc = await this.boardModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Board ${id} not found`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.boardModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Board ${id} not found`);
  }
}
