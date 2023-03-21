// Import the functions you need from the SDKs you need
import dotenv from "dotenv";

const result = dotenv.config()

export const firebaseConfig = {
  apiKey: process.env.firebase_key,
  authDomain: process.env.firebase_authdomain,
  projectId: process.env.firebase_projectid,
  storageBucket: process.env.firebase_storagebucket,
  messagingSenderId: process.env.firebase_messagingsenderid,
  appId: process.env.firebase_appid,
  measurementId: process.env.firebase_measurmentid
};

