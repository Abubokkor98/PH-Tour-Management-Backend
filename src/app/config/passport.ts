import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVariables } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVariables.GOOGLE_CLIENT_ID,
      clientSecret: envVariables.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariables.GOOGLE_CALLBACK_URL,
    }, async()=>{}
  )
);
