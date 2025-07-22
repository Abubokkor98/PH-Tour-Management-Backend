import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";
import { ZodError } from "zod";

export const handlerZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue) => ({
    path: issue.path.join(".") || "unknown",
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Zod Validation Error",
    errorSources,
  };
};
