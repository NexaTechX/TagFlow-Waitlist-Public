import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfa_tIVAwxsuoFH0x3ONhmsiwnlbpBi_I",
  authDomain: "tagflow-waitlist.firebaseapp.com",
  projectId: "tagflow-waitlist",
  storageBucket: "tagflow-waitlist.firebasestorage.app",
  messagingSenderId: "856421117954",
  appId: "1:856421117954:web:7f7d7365f9e768c070b71b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 