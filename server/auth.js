import {auth, db} from "./config/config";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {createFirestoreUser} from "./user";

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
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
        url: "https://localhost"
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