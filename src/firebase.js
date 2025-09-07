import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA68F3dKhfiYSpgqhqJ6kPC_4vcttGt7NE",
  authDomain: "trestle-labs-fsd.firebaseapp.com",
  projectId: "trestle-labs-fsd",
  storageBucket: "trestle-labs-fsd.appspot.com",
  messagingSenderId: "792255261922",
  appId: "1:792255261922:web:22a1ad60f610cf6fe8c2bb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
