const userRouter = require("./user.router");
const uploadImageRouter = require("./image.router");
const passport = require("passport");
const oauthFb = require("../app/middlewares/auth.fb")

function Routers(app) {
  app.use("/api/user", userRouter);
  app.use("/api/upload", uploadImageRouter);
  app.get("/api/", (req, res) => {
    res.send({ message: "Deploy Ok!" });
  });
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

  /* app.get("/auth/facebook/callback",  passport.authenticate(
    "facebook",
    { session: false }), (req, res) => {
      res.status(200).json({ token: req.user });
    }); */

    app.get("/auth/facebook/callback",  passport.authenticate(
      "facebook", { session: false }),oauthFb);
}

module.exports = Routers;
