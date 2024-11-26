import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function seedData() {
  try {
    const updatesRef = collection(db, 'updates');
    
    await addDoc(updatesRef, {
      title: "Test Update",
      content: "This is a test update",
      created_at: new Date().toISOString(),
      comments: [],
      image_url: "https://picsum.photos/200"
    });

    console.log('Test data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData(); 