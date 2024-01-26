import {updateProfile} from "firebase/auth";
import {arrayRemove, arrayUnion, doc, getDoc, increment, updateDoc, writeBatch} from "firebase/firestore"
import {getCircleCover, getCircleLogo, setProfilePicture} from "./storage";
import {auth, db} from "./config/config";
import {useQuery} from "@tanstack/react-query";


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
            username: username,
            friend_count: 0,
            friends: [],
            circle_count: 0,
            circles: []
        });

        batch.set(takenRef, {
            uid: user.uid,
            email: user.email
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

export async function joinCircle(user, circle) {
    const userRef = doc(db, `users/${user}`)
    try {
        await updateDoc(userRef, {
            circle_count: increment(1),
            circles: arrayUnion(circle)
        })
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

export async function leaveCircle(user, circle) {
    const userRef = doc(db, `users/${user}`)
    try {
        await updateDoc(userRef, {
            circle_count: increment(-1),
            circles: arrayRemove(circle)
        })
    } catch (err) {
        console.warn(err.message);
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
        }

        // Update Firebase phoneNumber
        if (phoneNumber) {
            batch.update(userRef, {phoneNumber: phoneNumber})
        }

        // Update Auth and Firebase Display Name and Auth photo URL
        await updateProfile(user, profile);
        batch.update(userRef, {displayName: displayName})

        await batch.commit()
        console.log("Initialize User: Success")
    } catch (err) {
        throw err;
    }
}

export async function getCircles(circles) {
    try {
        return await Promise.all(circles.map(async circle => {
            return await getCircle(circle)
        }))
    } catch(err) {
        console.log("Get Circles Error:", err)
        throw err;
    }
}

export async function getCircle(circle) {
    const circleRef = doc(db, `circles/${circle}`)
    console.log("GET CIRCLE", circle)

    try {
        let res = await getDoc(circleRef)
        res = res.data()
        res.cover = await getCircleCover(circle)
        res.logo = await getCircleLogo(circle)
        return res
    } catch(err) {
        console.log("Get Circle Error:", err)
        throw err;
    }
}