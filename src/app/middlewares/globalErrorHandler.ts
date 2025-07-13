/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message: message,
    error,
    stack: envVariables.NODE_ENV === "development" ? error.stack : null,
  });
};
