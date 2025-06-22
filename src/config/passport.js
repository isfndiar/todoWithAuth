import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await UserModel.create({
            email: profile.emails[0].value,
            googleId: profile.id,
            picture: profile.photos[0].value,
            username: profile.displayName,
            isGoogleUser: true,
          });
        } else {
          // if user exist but  wasn't a google user before, update their info
          if (!user.isGoogleUser) {
            user.googleId = profile.id;
            user.picture = profile.photos[0].value;
            user.isGoogleUser = true;
            await user.save();
          }
        }
        // Generate JWT token
        const payload = {
          id: user.id,
          email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        // Attach token to user object
        user.token = token;

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
