import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const authRoute = Router();
authRoute.post("/login", AuthControllers.credentialsLogin);
authRoute.post("/refresh-token", AuthControllers.getNewAccessToken);
authRoute.post("/logout", AuthControllers.logout);
authRoute.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

export default authRoute;
