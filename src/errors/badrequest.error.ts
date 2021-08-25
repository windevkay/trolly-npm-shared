import { CustomError } from "./custom.error";
import { ErrorStructure } from "./interface";

export class BadRequestError extends CustomError {
  public statusCode = 400;
  public message: string;

  constructor(error: string) {
    super("Bad Request error");
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.message = error;
  }

  serializeErrors = (): ErrorStructure[] => {
    return [{ message: this.message }];
  };
}
