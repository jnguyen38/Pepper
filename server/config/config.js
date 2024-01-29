import {initializeApp} from "firebase/app";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {firebaseConfig} from "../../src/js/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getAnalytics } from "firebase/analytics";

// Initialize firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})
const storage = getStorage();

export {db, app, auth, storage}