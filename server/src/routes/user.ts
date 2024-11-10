import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { query } from "../db-config";

interface User {
  user_id: string;
  password: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) res.status(401).send("Unauthorized access: Token is required");
  else {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
      if (err) res.status(403).send("Invalid token");
      else {
        req.user = user;
        next();
      }
    });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password later
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    console.log(result);
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      res.status(400).send("User not found");
      return;
    }

    const user = result.rows[0] as User;

    // Compare the provided password with the hashed password
    // const isMatch = await bcrypt.compare(password, user.password);

    const isMatch = password === user.password;

    if (!isMatch) {
      res.status(400).send("Invalid password");
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 3600000,
    });
    res.json({ message: "Login successful." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
};

const user = { authenticateToken, register, login };

export default user;
