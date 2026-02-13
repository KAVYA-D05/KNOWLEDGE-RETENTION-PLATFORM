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
    failureRedirect: "http://localhost:3000/login",
    session: true,
  }),
  (req, res) => {
    const name = req.user.name;
    const email = req.user.email;

    console.log("Google login success:", name, email);

    res.redirect(
      `http://localhost:3000/google-success?name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}`
    );
  }
);

/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/login");
  });
});

export default router;
