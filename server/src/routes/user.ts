import { Request, Response, Router } from "express";
import { query } from "../db-config";
import bcrypt from "bcryptjs";
import passport from "passport";
import { DatabaseError } from "pg";

const router = Router();

// Register user
router.post("/register", async (req: Request, res: Response) => {
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
});

// Login user
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user);
});

router.delete("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid").send({ message: "Logged out successfully" });
  });
});

router.post("/update", async (req: Request, res: Response) => {
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
});

// For user creation by admin
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      date_of_birth,
      is_admin = false,
      is_guest = false,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      res
        .status(400)
        .json({ message: "First name, last name, and email are required." });
      return;
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // SQL Query to insert the user
    const insertQuery = `
      INSERT INTO users (
        first_name, last_name, email, password, phone_number, date_of_birth, is_admin, is_guest
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING user_id, first_name, last_name, email, created_at, is_admin, is_guest;
    `;

    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      date_of_birth,
      is_admin,
      is_guest,
    ];

    const result = await query(insertQuery, values);

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof DatabaseError) {
      res.status(409).json({ message: error.detail });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Query the database to fetch the user by userId
    const result = await query(
      `SELECT user_id, first_name, last_name, email, phone_number, date_of_birth, is_admin, is_guest, created_at, updated_at
      FROM users WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // If no user is found with the provided userId
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Send the user data as response
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    if (error instanceof DatabaseError) {
      // Handling database-specific errors
      res.status(500).json({ message: "Database error" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.put("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    is_admin,
    is_guest,
    password,
  } = req.body;

  if (!first_name || !last_name || !email || !userId) {
    res.status(400).json({
      message: "First name, last name, email, and user ID are required.",
    });
    return;
  }

  try {
    // Prepare the update query
    let queryText = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, phone_number = $4, 
          date_of_birth = $5, is_admin = $6, is_guest = $7, updated_at = CURRENT_TIMESTAMP
    `;
    const queryValues = [
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      is_admin,
      is_guest,
    ];

    // If a password is provided, hash it and include it in the update query
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      queryText += ", password = $8";
      queryValues.push(hashedPassword);
    }

    // Append the condition to update only the specific user
    queryText +=
      " WHERE user_id = $9 RETURNING user_id, first_name, last_name, email, phone_number, date_of_birth, is_admin, is_guest, updated_at";

    // Add the userId to the values for the WHERE condition
    queryValues.push(userId);

    // Execute the query to update the user
    const result = await query(queryText, queryValues);

    // Check if user exists
    if (result.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return the updated user data
    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof DatabaseError) {
      res.status(409).json({ message: error.detail });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
