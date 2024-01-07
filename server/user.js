import {updateProfile} from "firebase/auth";
import {doc, getDoc, writeBatch} from "firebase/firestore"
import {setProfilePicture} from "./storage";
import {auth, db} from "./config/config";


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

export async function resetDisplayName() {
    const user = auth.currentUser;
    try {
        await updateProfile(user, {displayName: ""});
        console.log("profile displayName reset")
    } catch (err) {
        throw err;
    }
}


// Initializes Auth/Firestore User Display Name, Auth/Firestore photoURL,
// and Firestore phoneNumber (Auth phoneNumber is not supported on web API Jan2024)
export async function initializeUserInfo(displayName, phoneNumber, photoURL) {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid)
    const profile = {displayName: displayName,}
    const batch = writeBatch(db);

    try {
        // Set photo url storage
        if (photoURL) {
            profile.photoURL = await setProfilePicture(photoURL, user.uid)
            batch.update(userRef, {photoURL: profile.photoURL})
            console.log("Stored photo url")
        }

        // Update Firebase phoneNumber
        if (phoneNumber) {
            batch.update(userRef, {phoneNumber: phoneNumber})
        }

        // Update Auth and Firebase Display Name and Auth photo URL
        await updateProfile(user, profile);
        batch.update(userRef, {displayName: displayName})

        await batch.commit()
        console.log("Success")
    } catch (err) {
        throw err;
    }
}