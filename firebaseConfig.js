// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBelrIU-PV4HMbf3FqlmkZ3-Hobi42BU8Y",
  authDomain: "realtime-chatapp-63234.firebaseapp.com",
  projectId: "realtime-chatapp-63234",
  storageBucket: "realtime-chatapp-63234.appspot.com",
  messagingSenderId: "1020688932155",
  appId: "1:1020688932155:web:ba6b4b3f6ebea06d0aeb1e",
  measurementId: "G-VET43GZ83X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GithubAuthProvider();
export const db = getFirestore(app);
export const database = getDatabase(app);
// const analytics = getAnalytics(app);