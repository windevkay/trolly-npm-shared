import { ValidationError } from "express-validator";

import { CustomError } from "./custom.error";
import { ErrorStructure } from "./interface";

export class RequestValidationError extends CustomError {
  public statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Request params validation error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors = (): ErrorStructure[] => {
    return this.errors.map((error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    });
  };
}
