import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js'; // Add .js if using ES modules
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Use your auth routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB and start server
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });