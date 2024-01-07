import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {firebaseConfig} from "../../src/js/firebase";
// import { getAnalytics } from "firebase/analytics";

// Initialize firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage();

export {db, app, auth, storage}