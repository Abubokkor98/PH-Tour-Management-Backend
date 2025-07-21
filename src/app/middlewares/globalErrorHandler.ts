/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  //Duplicate error
  if (error.code == 11000) {
    const matchedArray = error.message.match(/"([^"]+)"/);
    console.log(matchedArray);
    statusCode = 400;
    message = `${matchedArray[1]} already exist`;
  }
  //ObjectId/ Cast error
  else if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ObjectId, please provide a valid ID`;
  }
  //Validation Error (type mismatch, required fields, etc.) //* will have to validate mutiple wrong field as well*/
  else if (error.name === "ValidationError") {
    statusCode = 400;
    const errorDetails = Object.values(error.errors).map((err: any) => {
      return `Field "${err.path}" - ${err.message}`;
    });
    message = `Validation failed: ${errorDetails.join("; ")}`;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error,
    stack: envVariables.NODE_ENV === "development" ? error.stack : null,
  });
};
