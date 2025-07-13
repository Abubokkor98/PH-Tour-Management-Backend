import { UserController } from "./user.controller";
import { Router } from "express";

const userRoute = Router();

userRoute.post("/register", UserController.createUser);
userRoute.get("/", UserController.getAllUser);

export default userRoute;

// route matching -> controller -> service -> model -> DB
