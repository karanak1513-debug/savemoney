// ============================================================
// VAULT.FI — Firebase Configuration
// Project: savemoneymanually
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDhpvyxivB2GVEhbHMlTVByGt5lxNR_As",
  authDomain: "savemoneymanually.firebaseapp.com",
  projectId: "savemoneymanually",
  storageBucket: "savemoneymanually.firebasestorage.app",
  messagingSenderId: "415442077873",
  appId: "1:415442077873:web:0cd96a3f5941c49268ba90",
  measurementId: "G-TFMH546K9F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const googleProvider = provider;

export {
  app,
  auth,
  db,
  provider,
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
  firebaseConfig,
};
export default app;
