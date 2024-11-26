import { db } from '../src/lib/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function seedData() {
  try {
    // Add a test update
    const updateRef = await addDoc(collection(db, 'updates'), {
      title: "Welcome to TagFlow",
      content: "Thank you for joining our waitlist! We'll keep you updated on our progress.",
      created_at: serverTimestamp(),
      comments: [],
      author: 'admin'
    });

    console.log('Test update added with ID:', updateRef.id);

    // Add a test admin session
    await addDoc(collection(db, 'admin_sessions'), {
      authenticated: false,
      timestamp: serverTimestamp()
    });

    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData(); 