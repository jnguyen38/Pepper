import {auth, db} from "./config/config";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    writeBatch
} from "firebase/firestore";
import * as Linking from 'expo-linking'

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        userCredential.user;
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function getUser(uid) {
    try {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)
        return docSnap.data()
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function checkUsername(username) {
    try {
        const docRef = doc(db, "takenUsernames", username)
        const user = await getDoc(docRef)
        return user.exists()
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function createFirestoreUser(user, username) {
    try {
        const usersRef = doc(db, "users", user.uid)
        const takenRef = doc(db, "takenUsernames", username)
        const batch = writeBatch(db);

        batch.set(usersRef, {
            uid: user.uid,
            creationTime: user.metadata.creationTime,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            photoURL: user.photoURL,
            username: username
        });

        batch.set(takenRef, {
            uid: user.uid
        });

        await batch.commit();
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function register(username, email, password) {
    username = username.toLowerCase()
    const userExists = await checkUsername(username);
    if (userExists)  {
        throw {
            code: "auth/username-already-exists",
            message: "This username already exists"
        };
    }
    if (userExists === undefined) {
        throw {
            code: "auth/failed-username-check",
            message: "Unknown failure"
        };
    }

    try {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                createFirestoreUser(userCredentials.user, username);
                console.log("Successfully created user")
                return userCredentials.user
            }).catch(err=> {
                console.warn(err);
                throw err;
            })
    } catch (err) {
        console.error("Sign up error:", err.code, err.message);
        throw err;
    }
}

export async function emailVerification() {
    const user = auth.currentUser;
    const actionCodeSettings = {
        handleCodeInApp: true,
        url: null
    };
    try {
        await sendEmailVerification(user, actionCodeSettings).then(() => {
            console.log("Sent email to", user.email)
        });
    } catch (err) {
        console.error("Email verification error:", err.code, err.message);
        throw err;
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email).then(() => {
            console.log("Password reset successful")
        })
    } catch (err) {
        console.error("Password reset error:", err.code, err.message);
        throw err;
    }
}

export async function logoutFirebase() {
    return signOut(auth).then(() => {
        console.log("Signed out successfully");
    }).catch((err) => {
        console.error("Sign out error:", err.code, err.message);
        throw err;
    });
}