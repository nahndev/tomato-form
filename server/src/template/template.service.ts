import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Template, TemplateDocument } from "./template.schema";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {}

  async create(dto: CreateTemplateDto): Promise<Template> {
    const doc = new this.templateModel({
      id: uuidv4(),
      name: dto.name,
      widgets: dto.widgets ?? {},
      layouts: dto.layouts ?? {},
      properties: dto.properties ?? {},
    });
    return doc.save();
  }

  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }

  async findOne(id: string): Promise<Template> {
    const doc = await this.templateModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Template ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    const doc = await this.templateModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Template ${id} not found`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.templateModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Template ${id} not found`);
  }
}
