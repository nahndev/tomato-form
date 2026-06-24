import { Injectable } from "@nestjs/common";

export type CronEventFactory = (payload: Record<string, unknown>) => object;

@Injectable()
export class CronEventRegistry {
  private readonly factories = new Map<string, CronEventFactory>();

  bind(type: string, factory: CronEventFactory): void {
    this.factories.set(type, factory);
  }

  toEvent(type: string, payload: Record<string, unknown>): object {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`No event registered for type "${type}"`);
    }
    return factory(payload);
  }
}
