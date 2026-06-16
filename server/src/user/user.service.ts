import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGateway } from "./user.gateway";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly userGateway: UserGateway,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const doc = new this.userModel({
      uuid: uuidv4(),
      name: dto.name,
    });
    const saved = await doc.save();
    this.userGateway.emitUsers(await this.findAll());
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(uuid: string): Promise<User> {
    const doc = await this.userModel.findOne({ uuid }).exec();
    if (!doc) throw new NotFoundException(`User ${uuid} not found`);
    return doc;
  }

  async update(uuid: string, dto: UpdateUserDto): Promise<User> {
    const doc = await this.userModel
      .findOneAndUpdate({ uuid }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`User ${uuid} not found`);
    this.userGateway.emitUsers(await this.findAll());
    return doc;
  }

  async remove(uuid: string): Promise<void> {
    const result = await this.userModel.deleteOne({ uuid }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`User ${uuid} not found`);
    this.userGateway.emitUsers(await this.findAll());
  }
}
