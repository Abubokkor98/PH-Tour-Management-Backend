import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";

import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to PH Tour Management Backend",
  });
});

//Global error handling middleware
app.use(globalErrorHandler);

export default app;
