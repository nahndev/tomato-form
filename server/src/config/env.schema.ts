import { plainToInstance } from "class-transformer";
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export class EnvironmentVariables {
  @IsIn(["development", "production", "test"])
  NODE_ENV!: string;

  @IsNumber()
  @IsOptional()
  PORT: number = 3022;

  @IsString()
  MONGODB_URI!: string;

  @IsString()
  CORS_ORIGIN!: string;
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
