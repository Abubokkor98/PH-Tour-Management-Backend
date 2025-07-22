/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { handleCastError } from "../helpers/handleCastError";

import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";
import { envVariables } from "../config/env"; // Load environment variables
import { handlerDuplicateError } from "../helpers/handleDuplicateError";

// This middleware will catch all errors thrown in the app
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Show full error and stack trace only in development mode
  if (envVariables.NODE_ENV === "development") {
    console.log("💥 Global Error Handler:", err);
  }

  // Default fallback values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources[] = [];

  // ==============================
  //  Handle AppError (custom error class)
  // ==============================
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ==============================
  // Handle MongoDB Duplicate Key Error (e.g., email already exists)
  // ==============================
  else if (err?.code === 11000) {
    const simplified = handlerDuplicateError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  }

  // ==============================
  // Handle Mongoose Validation Error (e.g., required field missing)
  // ==============================
  else if (err?.name === "ValidationError") {
    const simplified = handlerValidationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  }
  /**
   *
   */
  // ==============================
  //  Handle Mongoose Cast Error (e.g., invalid ObjectId format)
  // ==============================
  else if (err?.name === "CastError") {
    const simplified = handleCastError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  }

  // ==============================
  //  Handle Zod Validation Error (for request body/params)
  // ==============================
  else if (err?.name === "ZodError") {
    const simplified = handlerZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  }

  // ==============================
  //  Handle native JS Error object as fallback
  // ==============================
  else if (err instanceof Error) {
    message = err.message;
  }

  // ==============================
  //  Final Error Response
  // ==============================
  res.status(statusCode).json({
    success: false,
    message, // General error message
    errorSources, // List of specific field errors (if any)
    // Only show stack trace and full error object in development
    ...(envVariables.NODE_ENV === "development" && {
      err,
      stack: err.stack,
    }),
  });
};
