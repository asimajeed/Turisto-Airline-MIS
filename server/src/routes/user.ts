import { Request, Response } from "express";
import { query } from "../db-config";
import bcrypt from "bcryptjs";

const userRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if ((await query("SELECT 1 FROM users WHERE email = $1", [email])).rows[0])
      res.status(400).send("User already exists");
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [firstName, lastName, email, hashedPassword]
      );
      res.status(201).send("User registered");
    }
  } catch (err) {
    res.status(500).send("Error registering user");
    console.error(err);
  }
};

const userLogout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid").send({ message: "Logged out successfully" });
  });
};

const userUpdate = async (req: Request, res: Response) => {
  if (!(req.isAuthenticated() && req.user)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  const { first_name, last_name, email, phone_number, date_of_birth } =
    req.body;
  const userId = req.user.user_id;

  if (!first_name || !last_name || !email) {
    res
      .status(400)
      .json({ message: "First name, last name, and email are required." });
    return;
  }

  try {
    const queryStr = `
      UPDATE users
      SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        phone_number = $4,
        date_of_birth = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
      RETURNING *;
    `;
    const values = [
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      userId,
    ];

    const result = await query(queryStr, values);

    if (result.rows.length > 0) {
      const updatedUser = result.rows[0];
      res.status(200).json({
        message: "User information updated successfully.",
        user: {
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          date_of_birth: updatedUser.date_of_birth,
          loyalty_points: updatedUser.loyalty_points,
          loyalty_points_redeemed: updatedUser.loyalty_points_redeemed,
        },
      });
      return;
    } else {
      res.status(404).json({ message: "User not found." });
      return;
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user." });
    return;
  }
};

export { userRegister, userLogout, userUpdate };
