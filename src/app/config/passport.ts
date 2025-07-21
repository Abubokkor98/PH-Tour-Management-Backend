import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVariables } from "./env";
import { User } from "../modules/user/user.model";

// Configure the Google OAuth strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: envVariables.GOOGLE_CLIENT_ID,
      clientSecret: envVariables.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariables.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        // Extract the user's email from the Google profile
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No Email Found" });
        }

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new one using Google profile data
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            image: profile.photos?.[0].value,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        // Authentication successful, return the user
        return done(null, user);
      } catch (error) {
        // If something goes wrong, return the error
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);
