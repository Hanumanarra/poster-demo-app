// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZFd1L2fwp5seZaytfNTYOszhFJ-Bg3H8",
  authDomain: "tenzies-aa196.firebaseapp.com",
  projectId: "tenzies-aa196",
  storageBucket: "tenzies-aa196.firebasestorage.app",
  messagingSenderId: "167090307831",
  appId: "1:167090307831:web:1b8c7042712e19af4409f2",
  measurementId: "G-RE0XZB8BNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // or getDatabase(app)

export { db };