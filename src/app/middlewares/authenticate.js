const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const tokenStore = require('../storages/token.store');
const userStore = require('../storages/user.store');
const { errorCustom, errorInternalServer } = require('../views/error');
const jwtConfig = require('../../configs/jwt');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY, // Replace with your JWT secret key
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Assuming you have a user model, replace this logic with your actual user retrieval
    const user = await userStore.findUserById(payload.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, payload);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = async function Authenticated(req, res, next) {
  var token = req.header("Authorization");
  // get and split token
  token = jwtConfig.extractBearerToken(token);
  if (!token) return res.status(401).send(errorCustom(401, "Invalid token!"));

  const tokenExists = await tokenStore.findTokenByTokenStr(token);
  if (!tokenExists) {
    return res.status(403).send(errorCustom(401, 'Token is expired!'));
  }

  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error('Error checking token:', err);
      return res.status(500).send(errorInternalServer(err));
    }
    if (!user) {
      return res.status(401).send(errorCustom(401, 'Unauthorized!'));
    }
    req.user = user; // Set the user in the request object
    next();
  })(req, res, next);
};
