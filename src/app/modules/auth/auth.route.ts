import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRoute = Router();
authRoute.post("/login", AuthControllers.credentialsLogin);

export default authRoute;
