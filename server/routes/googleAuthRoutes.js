import express from "express";
import passport from "passport";

const router = express.Router();

/* ================= START GOOGLE LOGIN ================= */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* ================= GOOGLE CALLBACK ================= */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => {
    const name = req.user.name;
    const email = req.user.email;

    console.log("Google login success:", name, email);

    res.redirect(
      `${process.env.CLIENT_URL}/google-success?name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}`
    );
  }
);

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  });
});

export default router;