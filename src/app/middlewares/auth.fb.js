const passport = require("passport");
const { simpleSuccessResponse } = require("../views/response_to_client");
const jwt = require("../../configs/jwt");

module.exports = async function CallbackOAuthFacebook(req, res, next) {
  passport.authenticate(
    "facebook",
    {
      successMessage: "Login successful!",
      failureMessage: "Login failed!",
      successRedirect: "/",
      failureRedirect: "/",
    },
    async (err, user) => {
      if (err) {
        return res.status(500).send(errorInternalServer(err));
      }
      if (!user) {
        return res.status(401).send(errorCustom(401, "Unauthorized!"));
      }
      req.user = {
        userId: user._id,
        role: user.role,
      };

      jwt.generateToken({
        userId: user._id,
        role: user.role,
      });
      res.status(200).send(
        simpleSuccessResponse(
          jwt.generateToken({
            userId: user._id,
            role: user.role,
          }),
          "Authorized!"
        )
      );
    }
  );
};
