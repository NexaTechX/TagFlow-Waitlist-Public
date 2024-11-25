import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now },
  comments: [{
    user_email: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    admin_reply: { type: String },
    admin_reply_at: { type: Date }
  }]
});

export const Update = mongoose.model('Update', updateSchema); 