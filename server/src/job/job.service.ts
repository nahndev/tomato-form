import { Injectable, NotFoundException } from "@nestjs/common";
import { Action, ActionType, Job, Prisma } from "@/database/prisma-client";
import { isPrismaNotFoundError } from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CronEmitter } from "../emitter/cron/cron.emitter";
import { JobTriggeredEvent } from "../shared/events/job-triggered.event";
import { CreateJobActionDto, CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

export type JobWithActions = Job & { actions: Action[] };

function toActionCreateInput(
  action: CreateJobActionDto,
  order: number,
): Prisma.ActionUncheckedCreateWithoutJobInput {
  if (action.type === ActionType.SUBMISSION_CREATION) {
    return {
      type: ActionType.SUBMISSION_CREATION,
      order,
      templateId: action.templateId,
      boardId: action.boardId,
      payload: {},
    };
  }

  return {
    type: ActionType.SEND_MAIL,
    order,
    payload: {
      recipients: action.recipients,
      content: action.content,
    } as unknown as Prisma.InputJsonValue,
  };
}

const ORDERED_ACTIONS_INCLUDE = {
  actions: { orderBy: { order: "asc" as const } },
};

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cronEmitter: CronEmitter,
  ) {}

  async create(dto: CreateJobDto, boardId: string): Promise<JobWithActions> {
    const doc = await this.prisma.job.create({
      data: {
        boardId,
        name: dto.name,
        expression: dto.expression,
        enable: false,
        actions: {
          create: dto.actions.map((action, order) =>
            toActionCreateInput(action, order),
          ),
        },
      },
      include: ORDERED_ACTIONS_INCLUDE,
    });

    if (doc.enable) {
      await this.cronEmitter.register(
        doc.id,
        doc.expression,
        new JobTriggeredEvent(doc.id),
      );
    }

    return doc;
  }

  async findByBoardId(boardId: string): Promise<Job[]> {
    return this.prisma.job.findMany({ where: { boardId } });
  }

  async findOne(id: string): Promise<JobWithActions> {
    const doc = await this.prisma.job.findUnique({
      where: { id },
      include: ORDERED_ACTIONS_INCLUDE,
    });
    if (!doc) throw new NotFoundException(`Job ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateJobDto): Promise<JobWithActions> {
    const doc = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.job.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException(`Job ${id} not found`);

      if (dto.actions) {
        await tx.action.deleteMany({ where: { jobId: id } });
      }

      return tx.job.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.expression !== undefined
            ? { expression: dto.expression }
            : {}),
          ...(dto.actions
            ? {
                actions: {
                  create: dto.actions.map((action, order) =>
                    toActionCreateInput(action, order),
                  ),
                },
              }
            : {}),
        },
        include: ORDERED_ACTIONS_INCLUDE,
      });
    });

    this.setEnabled(doc.id, false);
    return doc;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.job.delete({ where: { id } });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Job ${id} not found`);
      throw err;
    }
    await this.cronEmitter.remove(id);
  }

  async findExecutions(jobId: string) {
    await this.findOne(jobId);
    return this.prisma.jobExecution.findMany({
      where: { jobId },
      orderBy: { startedAt: "desc" },
    });
  }

  async setEnabled(id: string, enable: boolean): Promise<JobWithActions> {
    let doc: JobWithActions;
    try {
      doc = await this.prisma.job.update({
        where: { id },
        data: { enable },
        include: ORDERED_ACTIONS_INCLUDE,
      });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Job ${id} not found`);
      throw err;
    }

    if (doc.enable) {
      await this.cronEmitter.register(
        doc.id,
        doc.expression,
        new JobTriggeredEvent(doc.id),
      );
      return doc;
    }

    await this.cronEmitter.remove(doc.id);
    return doc;
  }
}
