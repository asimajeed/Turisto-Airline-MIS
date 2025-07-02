// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import { query } from "./db-config";

// // Extend the Express Request interface
// declare global {
//   namespace Express {
//     interface User {
//       user_id: number;
//       first_name: string;
//       last_name: string;
//       email: string;
//       phone_number: string;
//       date_of_birth: Date;
//       loyalty_points: number;
//       loyalty_points_redeemed: number;
//       created_at: Date;
//       updated_at: Date;
//       is_admin: boolean;
//       is_guest: boolean;
//     }

//     interface Request {
//       user?: User;
//     }
//   }
// }

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         const result = await query("SELECT * FROM users WHERE email = $1", [
//           email,
//         ]);
//         const user = result.rows[0];

//         if (!user) {
//           return done(null, false, { message: "No user with that email" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return done(null, false, { message: "Password incorrect" });
//         }
//         {
//           const { password, ...storeUser } = user;
//           return done(null, storeUser);
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.user_id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await query("SELECT * FROM users WHERE user_id = $1", [id]);
//     const { password, ...storeUser } = result.rows[0];

//     if (!storeUser) {
//       return done(new Error("User not found"), null);
//     }

//     done(null, storeUser);
//   } catch (err) {
//     console.error("Error deserializing user:", err);
//     done(err, null);
//   }
// });
