// import passportJwt from "passport-jwt";
// import prisma from "../prisma";
// import { ACCESS_SECRET } from "../constants";

// const Strategy = passportJwt.Strategy;
// const ExtractJwt = passportJwt.ExtractJwt;

// const jwtStrategy = new Strategy(
//   {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: ACCESS_SECRET!,
//   },
//   async (jwtPayload, done) => {
//     try {
//       const user = await prisma.app_user.findUnique({
//         where: { id: jwtPayload.id },
//       });

//       if (!user) {
//         // throw new Error("User not found");
//         return done(null, false, "User not found");
//       }

//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   }
// );

// export default jwtStrategy;
