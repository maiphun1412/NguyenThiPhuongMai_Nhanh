import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDcKIOvOsVUSN3uh5TvgpC5teWEthyrhHw",
  authDomain: "nhanhtravel-website.firebaseapp.com",
  databaseURL:
    "https://nhanhtravel-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nhanhtravel-website",
  storageBucket: "nhanhtravel-website.firebasestorage.app",
  messagingSenderId: "164568911436",
  appId: "1:164568911436:web:f3dc16b8232df1cdf52ee9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };