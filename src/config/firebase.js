// Firebase configuration and initialization
// TODO: Replace the placeholder values below with your actual Firebase project config
// from the Firebase console (Project settings → General → Your apps).

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace these values with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGyOksrN5VU5O2t-GIMq8kQP_wqbg1xEw",
  authDomain: "yourshop-2d813.firebaseapp.com",
  projectId: "yourshop-2d813",
  storageBucket: "yourshop-2d813.firebasestorage.app",
  messagingSenderId: "456731953038",
  appId: "1:456731953038:web:0a974374e39688306f46df"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

