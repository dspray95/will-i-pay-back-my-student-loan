import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "will-i-repay-my-student-loan",
  appId: "1:REDACTED_SENDER_ID:web:f0dabbac2b3dd90bf3f388",
  storageBucket: "REDACTED_STORAGE_BUCKET",
  apiKey: "REDACTED_API_KEY",
  authDomain: "REDACTED_AUTH_DOMAIN",
  messagingSenderId: "REDACTED_SENDER_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
