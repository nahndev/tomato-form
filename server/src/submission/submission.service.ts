import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Submission, SubmissionDocument } from "./submission.schema";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<SubmissionDocument>,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    const doc = new this.submissionModel({
      id: uuidv4(),
      boardId: dto.boardId,
      templateId: dto.templateId,
      data: dto.data ?? {},
    });
    return doc.save();
  }

  async findAll(boardId?: string): Promise<Submission[]> {
    return this.submissionModel.find(boardId ? { boardId } : {}).exec();
  }

  async findOne(id: string): Promise<Submission> {
    const doc = await this.submissionModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Submission ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    const doc = await this.submissionModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Submission ${id} not found`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.submissionModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Submission ${id} not found`);
  }
}
