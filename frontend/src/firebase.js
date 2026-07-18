import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbztFqL-4G2gTSuj7Soi-GiU26RF018aw",
  authDomain: "cancerauth.firebaseapp.com",
  projectId:"cancerauth",

  appId:"1:292400389703:web:a380c866456f1e21881b62",

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();