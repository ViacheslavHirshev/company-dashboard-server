import passport from "passport";
import localStrategy from "./strategies/localStrategy";
// import jwtStrategy from "./strategies/jwtStrategy";

export default function configurePassport() {
  passport.use("local-login", localStrategy);
  // passport.use("jwt", jwtStrategy);
}
