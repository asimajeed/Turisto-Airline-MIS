import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { query } from './db-config';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      
      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Password incorrect' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE user_id = $1', [id]);
    const user = result.rows[0];
    
    if (!user) {
      return done(new Error('User not found'), null);
    }
    
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null); 
  }
});

