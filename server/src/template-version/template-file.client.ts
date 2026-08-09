import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

interface MakeVersionFileRequest {
  templateId: string;
  version: string;
}

interface MakeVersionFileResponse {
  path: string;
}

interface TemplateFileGrpcClient extends grpc.Client {
  makeVersionFile(
    request: MakeVersionFileRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: MakeVersionFileResponse,
    ) => void,
  ): void;
}

interface TemplateFilePackage {
  template: {
    TemplateFile: grpc.ServiceClientConstructor;
  };
}

const PROTO_PATH = path.join(__dirname, "proto/template-file.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
});
const proto = grpc.loadPackageDefinition(
  packageDefinition,
) as unknown as TemplateFilePackage;

export class TemplateClientVersion {
  private readonly client: TemplateFileGrpcClient;

  constructor(target: string) {
    this.client = new proto.template.TemplateFile(
      target,
      grpc.credentials.createInsecure(),
    ) as unknown as TemplateFileGrpcClient;
  }

  /** Publishes the template's live draft as `version`, returning the new snapshot's path. */
  makeVersionFile(id: string, version: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.makeVersionFile(
        { templateId: id, version },
        (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(response.path);
        },
      );
    });
  }
}
