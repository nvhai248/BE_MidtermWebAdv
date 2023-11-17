const jwt = require("../../configs/jwt");
const tokenStore = require("../storages/token.store");
const { errorCustom, errorInternalServer } = require("../views/error");

// if user not logout => next
// else return error
async function isTokenInUse(token) {
  try {
    const tokenExists = await tokenStore.findTokenByTokenStr(token);
    if (!tokenExists) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
}

module.exports = function Authenticated(req, res, next) {
  var token = req.header("Authorization");
  // get and split token
  token = jwt.extractBearerToken(token);
  if (!token) return res.status(401).send(errorCustom(401, "Invalid token!"));

  isTokenInUse(token)
    .then((check) => {
      if (!check) {
        res.status(401).send(errorCustom(401, "The session is outdated!"));
      } else {
        // verify token
        try {
          var payload = jwt.verifyToken(token);
        } catch (error) {
          if (error.name === "TokenExpiredError") {
            res
              .status(401)
              .send(
                errorCustom(401, "Token has expired, Please sign in again!")
              );
            tokenStore.deleteTokenByTokenStr(token);
          } else {
            res
              .status(401)
              .send(errorCustom(401, "Invalid token or signature!"));
          }
        }

        req.user = payload;
        next();
      }
    })
    .catch((error) => {
      console.error("Error checking token:", error);
      res.status(500).send(errorInternalServer(error));
    });
};
