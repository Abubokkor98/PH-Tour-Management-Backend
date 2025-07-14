import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { Router } from "express";
import { createUserZodSchema } from "./user.validation";

const userRoute = Router();

userRoute.post("/register",validateRequest(createUserZodSchema),UserController.createUser);
userRoute.get("/", UserController.getAllUser);

export default userRoute;

// route matching -> controller -> service -> model -> DB
