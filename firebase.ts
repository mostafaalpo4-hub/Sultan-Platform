
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCc0y5yDtYuTbwSNXXMi4caXt8gNTptxXY",
  authDomain: "sultan-70115.firebaseapp.com",
  projectId: "sultan-70115",
  storageBucket: "sultan-70115.firebasestorage.app",
  messagingSenderId: "170272374509",
  appId: "1:170272374509:web:4f3cf4ea6c7910248496e4",
  measurementId: "G-VN8N4WWKCZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
