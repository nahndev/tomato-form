import { plainToInstance } from "class-transformer";
import { IsNumber, IsOptional, IsString, validateSync } from "class-validator";

export class EnvironmentVariables {
  @IsNumber()
  @IsOptional()
  PORT: number = 3028;

  @IsString()
  FILE_DIR!: string;

  @IsString()
  RABBITMQ_URL!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.toString()}`);
  }

  return validated;
}
