// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9-Zj-yXBA5-9VcH64rLDJDL7s65FcI-k",
  authDomain: "save-bite-4afc4.firebaseapp.com",
  projectId: "save-bite-4afc4",
  storageBucket: "save-bite-4afc4.firebasestorage.app",
  messagingSenderId: "895742288241",
  appId: "1:895742288241:web:a42f6cc08c421a2c6316d0",
  measurementId: "G-EHD2FD702H"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
