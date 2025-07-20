import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { NotFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";

const app = express();

//middlewares
app.use(
  expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to PH Tour Management Backend",
  });
});

//Global error handling middleware
app.use(globalErrorHandler);

//not found error handler
app.use(NotFound);

export default app;
