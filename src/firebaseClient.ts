// Import the functions you need from the SDKs you need
import { initializeApp,getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Import getStorage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSfB2EgKz3pA7QW0RqYRchyWpBfAKH1Xk",
  authDomain: "boostingfr-1e9a4.firebaseapp.com",
  projectId: "boostingfr-1e9a4",
  storageBucket: "boostingfr-1e9a4.firebasestorage.app",
  messagingSenderId: "942954185994",
  appId: "1:942954185994:web:47e4d65098c42acca666f3",
  measurementId: "G-H62HPJQWPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. Export storage instance