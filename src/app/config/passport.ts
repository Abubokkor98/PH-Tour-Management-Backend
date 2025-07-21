import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVariables } from "./env";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use "email" instead of default "username"
      passwordField: "password", // Explicitly set password field
    },
    async (email: string, password: string, done) => {
      try {
        // Find user by email
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done(null, false, { message: "User Doesn't Exist" });
        }

        /**
         * * if (!isUserExist) {
         ** return done("User Doesn't Exist");
         **}
         ** we can also use like this (module 29.3, 14:50 second)******
         */

        // If user registered with Google, prevent login with credentials
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated) {
          return done(null, false, {
            message:
              "You signed up using Google. To use credentials login, first log in with Google and set a password.",
          });
        }

        // Compare entered password with hashed password
        const isPasswordMatched = await bcryptjs.compare(
          password,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password Doesn't Match" });
        }

        // All good, return the user
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

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

// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token

// Bridge == Google -> user db store -> token
//Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
//Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access

// Tells Passport what data to save in the session (user._id in this case)
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id); // Only storing user ID in session
});

// Tells Passport how to retrieve the full user data from the session on each request
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id); // Fetch full user by ID
    done(null, user); // Attach full user to req.user
  } catch (error) {
    console.log(error);
    done(error); // If error occurs, authentication fails
  }
});
