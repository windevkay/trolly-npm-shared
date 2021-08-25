import { CustomError } from "./custom.error";
import { ErrorStructure } from "./interface";

export class DatabaseConnectionError extends CustomError {
  public statusCode = 500;
  public failureReason = "Error connecting to database";

  constructor() {
    super("Database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = (): ErrorStructure[] => {
    return [{ message: this.failureReason }];
  };
}
