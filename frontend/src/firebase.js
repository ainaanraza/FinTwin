
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA1XYWgtc0sGzhKxX_xiBO7ZYJ3aDC-jn8",
    authDomain: "fintwin-ec0a3.firebaseapp.com",
    projectId: "fintwin-ec0a3",
    storageBucket: "fintwin-ec0a3.firebasestorage.app",
    messagingSenderId: "368712798519",
    appId: "1:368712798519:web:a0716b804da0a587424ab2",
    measurementId: "G-C2055NT9NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };
