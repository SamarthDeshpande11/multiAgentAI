// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh14hb7M3yJBY5Jvy_fWniRgEBuCR4jAc",
  authDomain: "cortexai-a3eb6.firebaseapp.com",
  projectId: "cortexai-a3eb6",
  storageBucket: "cortexai-a3eb6.firebasestorage.app",
  messagingSenderId: "67332337262",
  appId: "1:67332337262:web:70507cacc5fe253959407f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
