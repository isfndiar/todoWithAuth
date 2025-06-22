import express from "express";
import passport from "../config/passport.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import authController from "../controller/auth-controller.js";
const router = express.Router();

router.get("/furina", (req, res) => {
  res.send("furina");
});

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.get
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ status: "success", message: "Logged out successfully" });
  });
});

router.get("/status", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user,
  });
});

router.get("/protected-route", isAuthenticated, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

export default router;
