// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVbuCZVOB48nDrjbZY-OE5g-dNWw1Dong",
  authDomain: "ai-travel-plan-b5f58.firebaseapp.com",
  projectId: "ai-travel-plan-b5f58",
  storageBucket: "ai-travel-plan-b5f58.appspot.com",
  messagingSenderId: "621737501522",
  appId: "1:621737501522:web:83f7fde43184f427db508b",
  measurementId: "G-BDPR1NVYVX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db=getFirestore(app)