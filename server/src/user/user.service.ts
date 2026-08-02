import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@/database/prisma-client";
import { isPrismaNotFoundError } from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserGateway } from "./user.gateway";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userGateway: UserGateway,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const saved = await this.prisma.user.create({
      data: { name: dto.name },
    });
    this.userGateway.emitUsers(await this.findAll());
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(uuid: string): Promise<User> {
    const doc = await this.prisma.user.findUnique({ where: { uuid } });
    if (!doc) throw new NotFoundException(`User ${uuid} not found`);
    return doc;
  }

  async update(uuid: string, dto: UpdateUserDto): Promise<User> {
    try {
      const doc = await this.prisma.user.update({
        where: { uuid },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.email !== undefined ? { email: dto.email } : {}),
        },
      });
      this.userGateway.emitUsers(await this.findAll());
      return doc;
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`User ${uuid} not found`);
      throw err;
    }
  }

  async remove(uuid: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { uuid } });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`User ${uuid} not found`);
      throw err;
    }
    this.userGateway.emitUsers(await this.findAll());
  }
}
