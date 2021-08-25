import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import {
  ErrorStructure,
  CustomError,
  RequestValidationError,
  NotAuthorizedError,
} from "../errors";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
/**
 * sanitize the params passed in during sign-up
 */
export const sanitizeSignupParams = () => {
  return [
    body("email").isEmail().withMessage("Email needs to be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ];
};
/**
 * sanitize the params passed in during sign-in
 */
export const sanitizeSigninParams = () => {
  return [
    body("email").isEmail().withMessage("Email needs to be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You need to provide a password"),
  ];
};
/**
 * Primary error handling middleware for the express app
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const serializedErrors: ErrorStructure[] = err.serializeErrors();
    res.status(err.statusCode).send({ errors: serializedErrors });
  }

  //generic response for unknown error types
  res.status(400).send("something went wrong...");
};
/**
 * error checking on request body fields
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
/**
 * check the JWT status on current user and set currentUser on req
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    next();
  }
  try {
    const payload = jwt.verify(
      req.session!.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}
  next();
};
/**
 * check status of currentUser on req object
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
