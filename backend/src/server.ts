import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Update } from './models/Update';
import { Waitlist } from './models/Waitlist';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Waitlist Routes
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    const waitlistUser = new Waitlist({ email });
    await waitlistUser.save();
    res.status(201).json(waitlistUser);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists in waitlist' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.get('/api/waitlist', async (req, res) => {
  try {
    const users = await Waitlist.find().sort('-joined_at');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Updates Routes
app.post('/api/updates', async (req, res) => {
  try {
    const update = new Update(req.body);
    await update.save();
    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/updates', async (req, res) => {
  try {
    const updates = await Update.find().sort('-created_at');
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments Routes
app.post('/api/updates/:updateId/comments', async (req, res) => {
  try {
    const { updateId } = req.params;
    const update = await Update.findById(updateId);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }
    update.comments.push(req.body);
    await update.save();
    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 