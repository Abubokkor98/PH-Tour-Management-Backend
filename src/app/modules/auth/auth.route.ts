import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const authRoute = Router();
authRoute.post("/login", AuthControllers.credentialsLogin);
authRoute.post("/refresh-token", AuthControllers.getNewAccessToken);
authRoute.post("/logout", AuthControllers.logout);
authRoute.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
authRoute.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
authRoute.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)

export default authRoute;
