import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRoute = Router();
authRoute.post("/login", AuthControllers.credentialsLogin);
authRoute.post("/refresh-token", AuthControllers.getNewAccessToken);
authRoute.post("/logout", AuthControllers.logout);

export default authRoute;
