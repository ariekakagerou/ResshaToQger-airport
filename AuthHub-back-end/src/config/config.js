// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMMUkA74EoNR43WpHdbfqNSYcX2ZnCdOI",
    authDomain: "authhub-bc3ce.firebaseapp.com",
    projectId: "authhub-bc3ce",
    storageBucket: "authhub-bc3ce.firebasestorage.app",
    messagingSenderId: "770511017150",
    appId: "1:770511017150:web:f8d78825520c9732687aef",
    measurementId: "G-BTP9C59PNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth()
export default db; // Pastikan menggunakan ekspor default