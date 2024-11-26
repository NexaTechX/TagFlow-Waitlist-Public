import { db } from '../src/lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function seedData() {
  try {
    // Add initial update
    const updateRef = await addDoc(collection(db, 'updates'), {
      title: "Welcome to TagFlow",
      content: "Thank you for joining our waitlist! We'll keep you updated on our progress.",
      created_at: serverTimestamp(),
      comments: [],
      image_url: "https://picsum.photos/200",
      author: 'admin'
    });

    console.log('Initial update added with ID:', updateRef.id);

    // Add initial admin session
    const adminRef = await addDoc(collection(db, 'admin_sessions'), {
      authenticated: false,
      timestamp: serverTimestamp()
    });

    console.log('Admin session created with ID:', adminRef.id);
    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 