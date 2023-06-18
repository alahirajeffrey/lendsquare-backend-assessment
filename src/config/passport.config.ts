import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import db from "../database/knexfile";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

const jwtStrategy = new Strategy(jwtOptions, async (payload, done) => {
  try {
    // Find the user based on the user id from the payload
    const user = await db
      .queryBuilder()
      .select()
      .from("users")
      .where({ id: payload.id })
      .first();

    // return false if user is not founf
    if (!user) {
      return done(null, false);
    }

    // return user if payload is correct
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);

// export default passport;
