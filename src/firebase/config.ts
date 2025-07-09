import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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

// Configure auth to use the app directly instead of Firebase Auth web
auth.useDeviceLanguage();

// Connect to auth emulator in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below if you want to use the auth emulator
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;