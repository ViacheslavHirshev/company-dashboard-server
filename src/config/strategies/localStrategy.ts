import passportLocal from "passport-local";
import prisma from "../prisma";
import { comparePassword } from "../../utils/password";

const Strategy = passportLocal.Strategy;

const localStrategy = new Strategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await prisma.app_user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return done(null, false, { message: `Email not found` });
      }

      const isPasswordCorrect = await comparePassword(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, {
          message: `Incorrect password`,
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;
