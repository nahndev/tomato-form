import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob as CronTimer } from "cron";
import { parseExpression } from "cron-parser";
import { Model } from "mongoose";
import { CronJob, CronJobDocument } from "../schemas/cron-job.schema";
import { JobRunner } from "./job-runner.service";

@Injectable()
export class JobScheduler implements OnModuleInit {
  constructor(
    @InjectModel(CronJob.name)
    private readonly cronJobModel: Model<CronJobDocument>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly jobRunner: JobRunner,
  ) {}

  async onModuleInit(): Promise<void> {
    const cronJobs = await this.cronJobModel.find({ enabled: true }).exec();
    for (const cronJob of cronJobs) {
      await this.schedule(cronJob);
    }
  }

  async schedule(cronJob: CronJob): Promise<void> {
    const nextRunAt = parseExpression(cronJob.cronExpression).next().toDate();
    await this.cronJobModel
      .findOneAndUpdate({ id: cronJob.id }, { $set: { nextRunAt } })
      .exec();

    const name = this.cronName(cronJob.id);
    if (this.schedulerRegistry.doesExist("cron", name)) {
      this.schedulerRegistry.deleteCronJob(name);
    }

    const timer = new CronTimer(cronJob.cronExpression, async () => {
      await this.jobRunner.run(cronJob);
    });
    this.schedulerRegistry.addCronJob(name, timer);
    timer.start();
  }

  unschedule(jobId: string): void {
    const name = this.cronName(jobId);
    if (this.schedulerRegistry.doesExist("cron", name)) {
      this.schedulerRegistry.deleteCronJob(name);
    }
  }

  async reschedule(cronJob: CronJob): Promise<void> {
    this.unschedule(cronJob.id);
    if (cronJob.enabled) {
      await this.schedule(cronJob);
    }
  }

  private cronName(jobId: string): string {
    return `job-${jobId}`;
  }
}
