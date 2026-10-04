import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from "class-validator";

export class EnvironmentVariables {
  @IsNumber()
  @IsOptional()
  PORT: number = 3030;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string = "http://localhost:3021";

  @IsString()
  @IsNotEmpty()
  GEMINI_AI_KEY!: string;

  @IsString()
  @IsOptional()
  GEMINI_MODEL: string = "gemini-2.5-flash";

  /** Log every request sent to the LLM. Accepts "true" / "false". */
  @IsString()
  @IsOptional()
  LLM_LOG_REQUESTS: string = "true";
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
