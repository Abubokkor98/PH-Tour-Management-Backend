import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRoute = Router();
authRoute.post("/login", AuthControllers.credentialsLogin);
authRoute.post("/refresh-token", AuthControllers.getNewAccessToken);

export default authRoute;
