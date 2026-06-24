export interface EventDescriptor {
  type: string;
  payload: unknown;
}

export class EventCodec {
  static encode(event: object): EventDescriptor {
    return {
      type: event.constructor.name,
      payload: { ...event } as Record<string, unknown>,
    };
  }

  static decode(descriptor: EventDescriptor): object {
    return { ...(descriptor.payload as Record<string, unknown>) };
  }
}
