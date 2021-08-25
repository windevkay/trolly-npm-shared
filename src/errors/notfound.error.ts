import { CustomError } from "./custom.error";
import { ErrorStructure } from "./interface";

export class NotFoundError extends CustomError {
  public statusCode = 404;
  constructor() {
    super("Route not found error");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors = (): ErrorStructure[] => {
    return [{ message: "Route not found" }];
  };
}
