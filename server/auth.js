import {auth} from "./config/config";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function register(email, password) {
    try {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log("User Credentials:", userCredentials.user)
                return userCredentials.user;
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
        url: "https://" + process.env.FIREBASE_AUTH_DOMAIN
    }
    try {
        await sendEmailVerification(user, actionCodeSettings).then(() => {
            console.log("Sent email to", user.email)
        })
    } catch (err) {
        console.error("Email verification error:", err.code, err.message);
        throw err;
    }
}

export async function resetPassword(email) {
    const actionCodeSettings = {
        handleCodeInApp: true,
        url: "https://" + process.env.FIREBASE_AUTH_DOMAIN
    }
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