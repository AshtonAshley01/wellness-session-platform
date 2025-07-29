import express from 'express';
// import router from '../server.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Add .js if using ES modules
// import user from '../models/user.model.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // 2. Hash the password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
  
      // 3. Create and save the new user
      const newUser = new User({ email, password:password_hash });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });


  // login route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1. Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // 3. Create JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret', // Use env var or fallback
        { expiresIn: '1h' }
      );
  
      // 4. Send token
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

export default router;