import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAv57bqzJgAg492cXdNGSRgFpZtDM0_vAM",
  authDomain: "transmetro-app-76e21.firebaseapp.com",
  projectId: "transmetro-app-76e21",
  storageBucket: "transmetro-app-76e21.firebasestorage.app",
  messagingSenderId: "1077303950153",
  appId: "1:1077303950153:web:a32ad122993e4010aab898",
  measurementId: "G-PRR68Z4TD2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);