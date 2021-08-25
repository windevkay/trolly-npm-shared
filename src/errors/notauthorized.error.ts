import { CustomError } from "./custom.error";
import { ErrorStructure } from "./interface";

export class NotAuthorizedError extends CustomError {
  public statusCode = 401;
  constructor() {
    super("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors = (): ErrorStructure[] => {
    return [{ message: "Not Authorized" }];
  };
}
