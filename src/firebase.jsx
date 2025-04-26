const NEXT_PUBLIC_APP_FIREBASE_APP_API_KEY = process.env.NEXT_PUBLIC_APP_FIREBASE_APP_API_KEY;
const NEXT_PUBLIC_APP_APP_AUTH_DOMAIN = process.env.NEXT_PUBLIC_APP_APP_AUTH_DOMAIN;
const NEXT_PUBLIC_APP_APP_PROJECT_ID = process.env.NEXT_PUBLIC_APP_APP_PROJECT_ID;
const NEXT_PUBLIC_APP_APP_STORAGE_BUCKET = process.env.NEXT_PUBLIC_APP_APP_STORAGE_BUCKET;
const NEXT_PUBLIC_APP_APP_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_APP_APP_MESSAGING_SENDER_ID;
const NEXT_PUBLIC_APP_APP_APP_ID = process.env.NEXT_PUBLIC_APP_APP_APP_ID;

import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: NEXT_PUBLIC_APP_FIREBASE_APP_API_KEY,
  authDomain: NEXT_PUBLIC_APP_APP_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_APP_APP_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_APP_APP_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_APP_APP_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_APP_APP_APP_ID
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);