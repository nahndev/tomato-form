import * as grpc from "@grpc/grpc-js";

export const DEFAULT_GRPC_TIMEOUT_MS = 30_000;

interface GrpcClientConstructor<T extends grpc.Client> {
  new (
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  ): T;
}

type UnaryCall<TRequest, TResponse> = (
  request: TRequest,
  metadata: grpc.Metadata,
  options: grpc.CallOptions,
  callback: (error: grpc.ServiceError | null, response: TResponse) => void,
) => grpc.ClientUnaryCall;

/** Builds a gRPC client with the project's shared credentials/options, so each service doesn't repeat that setup. */
export function createGrpcClient<T extends grpc.Client>(
  ClientCtor: GrpcClientConstructor<T>,
  target: string,
): T {
  return new ClientCtor(target, grpc.credentials.createInsecure());
}

/** Wraps a gRPC unary callback method as a Promise with a deadline, so callers don't repeat the Metadata/deadline/callback wiring. */
export function callUnary<TRequest, TResponse>(
  call: UnaryCall<TRequest, TResponse>,
  request: TRequest,
  timeoutMs: number = DEFAULT_GRPC_TIMEOUT_MS,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    call(request, new grpc.Metadata(), { deadline: Date.now() + timeoutMs }, (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(response);
    });
  });
}
