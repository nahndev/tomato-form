import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { parseExpression } from "cron-parser";

@ValidatorConstraint({ name: "isCronExpression", async: false })
class IsCronExpressionConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string") return false;
    try {
      parseExpression(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return "$property must be a valid cron expression";
  }
}

export function IsCronExpression(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCronExpression",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCronExpressionConstraint,
    });
  };
}
