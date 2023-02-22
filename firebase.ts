import {getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATtpfH_cSml0LS0aeq1Uy9h_UgoOuuJzc",
  authDomain: "chatgpt-clone-yt-b13df.firebaseapp.com",
  projectId: "chatgpt-clone-yt-b13df",
  storageBucket: "chatgpt-clone-yt-b13df.appspot.com",
  messagingSenderId: "303270009358",
  appId: "1:303270009358:web:97c0d57e96c68e7bcc3a5f",
  measurementId: "G-SM2QW2YW4G"
};

// Initialize Firebase
// Singleton pattern in coding
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };