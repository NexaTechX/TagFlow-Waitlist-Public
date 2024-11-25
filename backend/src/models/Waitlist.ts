import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  joined_at: { type: Date, default: Date.now },
  feedback: { type: String }
});

export const Waitlist = mongoose.model('Waitlist', waitlistSchema); 