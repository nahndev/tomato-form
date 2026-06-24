import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CronEmitter } from "../emitter/cron/cron.emitter";
import { EmitterService } from "../emitter/emitter.service";
import { JobTriggeredEvent } from "../shared/events/job-triggered.event";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobRunner } from "./job/job-runner.service";
import { Job, JobDocument } from "./schemas/job.schema";
import {
  JobExecution,
  JobExecutionDocument,
} from "./schemas/job-execution.schema";

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(JobExecution.name)
    private readonly jobExecutionModel: Model<JobExecutionDocument>,
    private readonly jobRunner: JobRunner,
    private readonly emitterService: EmitterService,
  ) {}

  async create(dto: CreateJobDto): Promise<Job> {
    const doc = await new this.jobModel({
      id: uuidv4(),
      name: dto.name,
      emitter: { expression: dto.expression },
      actions: dto.actions,
      enable: dto.enable ?? true,
    }).save();

    if (doc.enable) {
      await this.emitterService.register(
        doc.id,
        new CronEmitter(doc.emitter.expression),
        new JobTriggeredEvent(doc.id),
      );
    }

    return doc;
  }

  async findAll(boardId?: string): Promise<Job[]> {
    return this.jobModel
      .find(boardId ? { "actions.boardId": boardId } : {})
      .exec();
  }

  async findOne(id: string): Promise<Job> {
    const doc = await this.jobModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const { expression, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (expression !== undefined) {
      update["emitter.expression"] = expression;
    }

    const doc = await this.jobModel
      .findOneAndUpdate({ id }, { $set: update }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);

    // Always resync, not just when expression/enable change — the cron
    // emitter's persisted expression must stay in sync with the job's, and
    // toggling `enable` needs to register/unregister the schedule.
    if (doc.enable) {
      await this.emitterService.register(
        doc.id,
        new CronEmitter(doc.emitter.expression),
        new JobTriggeredEvent(doc.id),
      );
    } else {
      await this.emitterService.remove(doc.id);
    }

    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Job ${id} not found`);
    await this.emitterService.remove(id);
  }

  async findExecutions(jobId: string): Promise<JobExecution[]> {
    await this.findOne(jobId);
    return this.jobExecutionModel
      .find({ jobId })
      .sort({ startedAt: -1 })
      .exec();
  }

  async execute(jobId: string): Promise<void> {
    const job = await this.jobModel.findOne({ id: jobId }).exec();
    if (!job) return;
    await this.jobRunner.run(job);
  }
}
