import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAiLCSK-YAwwhLkFvPWAKlOza3hQXBSXqk",
  authDomain: "growinfo-d4950.firebaseapp.com",
  projectId: "growinfo-d4950",
  storageBucket: "growinfo-d4950.firebasestorage.app",
  messagingSenderId: "120336371069",
  appId: "1:120336371069:web:ff06518075b20d63fd1014",
  measurementId: "G-SFP6JYBH28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;