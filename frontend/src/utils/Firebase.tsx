
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "bufaaloide.firebaseapp.com",
  projectId: "bufaaloide",
  storageBucket: "bufaaloide.firebasestorage.app",
  messagingSenderId: "953183285155",
  appId: "1:953183285155:web:c5f6ee8cce1ed127df3416"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const googleprovider=new GoogleAuthProvider()
export{auth,googleprovider}
