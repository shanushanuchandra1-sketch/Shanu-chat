import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBv9wvTRSyS8mFkPl58nXJAZrEslwgbdzI",
  authDomain: "shanu-chat-75a94.firebaseapp.com",
  projectId: "shanu-chat-75a94",
  storageBucket: "shanu-chat-75a94.firebasestorage.app",
  messagingSenderId: "150384793297",
  appId: "1:150384793297:web:2795120dda37b4777357f0",
  measurementId: "G-RT0KBNN4XF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
