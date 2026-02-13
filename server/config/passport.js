import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

/* ================= GOOGLE CREDENTIAL CHECK ================= */
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("❌ ERROR: Google Credentials missing in process.env");
} else {
  console.log("✅ Google Credentials detected");
}

/* ================= GOOGLE STRATEGY ================= */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 🔍 Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
          // 🆕 Create new user if not exists
          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            isVerified: true, // Google users auto verified
          });
        }

        return done(null, user);

      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

/* ================= SERIALIZE USER ================= */
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session
});

/* ================= DESERIALIZE USER ================= */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
