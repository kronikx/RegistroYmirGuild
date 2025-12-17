// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBt9Kqhw6V1l5ZkQLK5FKxmeW1kQ68LIbE",
  authDomain: "registro-de-guild-en-ymir.firebaseapp.com",
  projectId: "registro-de-guild-en-ymir"
});

export const db = getFirestore(app);
