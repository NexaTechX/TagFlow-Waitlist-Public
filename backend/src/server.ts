import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { Update, Waitlist } from './models';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();
const options = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/private.key')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/certificate.crt')),
};

const server = process.env.NODE_ENV === 'production'
  ? https.createServer(options, app)
  : createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-url.com'
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-waitlist', async (email) => {
    try {
      const user = await Waitlist.create({ email });
      io.emit('waitlist-updated', user);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('post-update', async (update) => {
    try {
      const newUpdate = await Update.create(update);
      io.emit('update-posted', newUpdate);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 