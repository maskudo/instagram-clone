// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyA1kDCrWBMqX6BTFgNh3OWl8cLLBgVNfTM",

  authDomain: "instagram-clone-63cff.firebaseapp.com",

  projectId: "instagram-clone-63cff",

  storageBucket: "instagram-clone-63cff.appspot.com",

  messagingSenderId: "43546845457",

  appId: "1:43546845457:web:6fad98401bddd5f3dcecb0",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);
