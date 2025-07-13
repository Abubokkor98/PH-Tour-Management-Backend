import { UserController } from "./user.controller";
import { Router } from "express";

const userRoute = Router();

userRoute.post("/register", UserController.createUser);

export default userRoute;
