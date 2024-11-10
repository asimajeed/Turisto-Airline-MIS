import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { query } from './db-config';
import passport from 'passport';
import session from 'express-session';
import userRoutes from './routes/user';
import bcrypt from "bcryptjs"
import './passport-config'; // Import your passport configuration

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Register user
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
      name,
      email,
      hashedPassword,
    ]);
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Login user
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

// Example of a protected route
app.get('/profile', (req: Request, res: Response) => {
  // if (!(req as any).isAuthenticated()) {
  //   return res.status(401).send('You need to log in first');
  // }
  res.send((req as any).user);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
