const passport = require("passport");
const userStore = require("../app/storages/user.store");
const FacebookStrategy = require("passport-facebook").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY, // Replace with your JWT secret key
};

function setup() {
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
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
    })
  );

  // setting up facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          let user = userStore.findUserByFbId(profile.id);

          if (user) {
            done(null, user);
          }

          user = userStore.createUserAndReturn({
            fb_id: profile.id,
            name: profile.displayName,
            email: clientEmail,
            image: { url: profile.photos[0].value },
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

module.exports = { setup };
