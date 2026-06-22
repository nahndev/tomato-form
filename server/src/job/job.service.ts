import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobScheduler } from "./job/job-scheduler.service";
import { CronJob, CronJobDocument } from "./schemas/cron-job.schema";
import {
  JobExecution,
  JobExecutionDocument,
} from "./schemas/job-execution.schema";

@Injectable()
export class JobService {
  constructor(
    @InjectModel(CronJob.name)
    private readonly cronJobModel: Model<CronJobDocument>,
    @InjectModel(JobExecution.name)
    private readonly jobExecutionModel: Model<JobExecutionDocument>,
    private readonly jobScheduler: JobScheduler,
  ) {}

  async create(dto: CreateJobDto): Promise<CronJob> {
    const doc = await new this.cronJobModel({
      id: uuidv4(),
      name: dto.name,
      expression: dto.expression,
      actions: dto.actions,
      enable: dto.enable ?? true,
    }).save();

    if (doc.enable) {
      await this.jobScheduler.schedule(doc);
    }

    return doc;
  }

  async findAll(boardId?: string): Promise<CronJob[]> {
    return this.cronJobModel
      .find(boardId ? { "actions.boardId": boardId } : {})
      .exec();
  }

  async findOne(id: string): Promise<CronJob> {
    const doc = await this.cronJobModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateJobDto): Promise<CronJob> {
    const doc = await this.cronJobModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);

    // Always resync the scheduler, not just when expression/enable change —
    // the registered cron tick closure captures the whole `cronJob` object (e.g.
    // its actions), so any update must refresh it or a stale closure keeps
    // running with outdated action data.
    await this.jobScheduler.reschedule(doc);

    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cronJobModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Job ${id} not found`);
    this.jobScheduler.unschedule(id);
  }

  async findExecutions(jobId: string): Promise<JobExecution[]> {
    await this.findOne(jobId);
    return this.jobExecutionModel
      .find({ jobId })
      .sort({ startedAt: -1 })
      .exec();
  }
}
