import { ErrorStructure } from "./interface";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(
    message: string
  ) /**pass in a logging message when extending this class */ {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrorStructure[];
}
