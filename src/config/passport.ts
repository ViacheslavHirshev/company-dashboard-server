import passport from "passport";
import localStrategy from "./strategies/localStrategy";

export default function configurePassport() {
  passport.use("local-login", localStrategy);
}
