import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0ukaeq7C4pGsWdSF8tubfnJK3YP-ujlo",
  authDomain: "personal-task-manager-a90ec.firebaseapp.com",
  projectId: "personal-task-manager-a90ec",
  storageBucket: "personal-task-manager-a90ec.appspot.com",
  messagingSenderId: "700528552821",
  appId: "1:700528552821:web:e71b513d8bfe786daf013c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
