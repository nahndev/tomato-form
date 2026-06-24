export interface Emitter<TArgs extends unknown[] = unknown[]> {
  register(key: string, ...args: TArgs): Promise<void>;
  remove(key: string): Promise<void>;
}
