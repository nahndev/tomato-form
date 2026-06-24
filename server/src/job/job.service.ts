import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CronEmitter } from "../emitter/cron/cron.emitter";
import { JobRemovedEvent } from "../shared/events/job-removed.event";
import { JobTriggeredEvent } from "../shared/events/job-triggered.event";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import {
  JobExecution,
  JobExecutionDocument,
} from "./schemas/job-execution.schema";
import { Job, JobDocument } from "./schemas/job.schema";

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(JobExecution.name)
    private readonly jobExecutionModel: Model<JobExecutionDocument>,
    private readonly cronEmitter: CronEmitter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateJobDto): Promise<Job> {
    const doc = await new this.jobModel({
      id: uuidv4(),
      name: dto.name,
      expression: dto.expression,
      actions: dto.actions,
      enable: false,
    }).save();

    if (doc.enable) {
      await this.cronEmitter.register(
        doc.id,
        doc.expression,
        new JobTriggeredEvent(doc.id),
      );
    }

    return doc;
  }

  async findByIds(ids: string[]): Promise<Job[]> {
    return this.jobModel.find({ id: { $in: ids } }).exec();
  }

  async findOne(id: string): Promise<Job> {
    const doc = await this.jobModel.findOne({ id }).exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const doc = await this.jobModel
      .findOneAndUpdate({ id }, { $set: dto }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);
    this.setEnabled(doc.id, false);
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException(`Job ${id} not found`);
    await this.cronEmitter.remove(id);
    this.eventEmitter.emit(JobRemovedEvent.name, new JobRemovedEvent(id));
  }

  async findExecutions(jobId: string): Promise<JobExecution[]> {
    await this.findOne(jobId);
    return this.jobExecutionModel
      .find({ jobId })
      .sort({ startedAt: -1 })
      .exec();
  }

  async setEnabled(id: string, enable: boolean): Promise<Job> {
    const doc = await this.jobModel
      .findOneAndUpdate({ id }, { $set: { enable } }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Job ${id} not found`);

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
