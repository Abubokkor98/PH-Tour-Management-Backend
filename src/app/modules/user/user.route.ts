import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { Router } from "express";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRoute = Router();

userRoute.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
userRoute.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUser
);
userRoute.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export default userRoute;

// route matching -> controller -> service -> model -> DB
