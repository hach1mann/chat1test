import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// @author: Pedro Lisboa 2024
// Protected under MIT License
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "dark-chat-app.firebaseapp.com",
  projectId: "dark-chat-app",
  storageBucket: "dark-chat-app.appspot.com",
  messagingSenderId: "1040916525785",
  appId: "1:1040916525785:web:0d0c0e0b0b0b0b0b0b0b"
};

// PedroLisboa2024: Firebase initialization
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseConfig, db };
