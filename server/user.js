import {updateProfile} from "firebase/auth";
import {
    addDoc,
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    setDoc,
    updateDoc,
    writeBatch
} from "firebase/firestore"
import {getCircleCover, getCircleLogo, setProfilePicture} from "./storage";
import {auth, db} from "./config/config";
import {parseDownloadURL} from "../src/js/util";

/**
 * Function that is called at user registration time to
 * (1) create a new user in the firestore users collection and
 * (2) register a new document with the taken username, mapping to the email and uid of the username
 *
 * @param user UserCredential object
 * @param username Username of the user
 * @returns {Promise<void>} No return value
 */
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

/***
 * Function that is called at app initiation, after user is authenticated.
 *
 * @param uid UID of the current authenticated user
 * @returns {Promise<DocumentData>} User document in the users collection
 */
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

/***
 * Function that initializes a snapshot listener of the current user's friends collection
 *
 * @param setState Callback function of state to set
 * @returns {Unsubscribe} Unsubscriber called at dismount
 */
export function listenUserFriends(setState) {
    const colRef = collection(db, "users", auth.currentUser.uid, "friends")
    return onSnapshot(colRef, snapshot => {
        let ids = snapshot.docs.map(doc => doc.id)
        console.log("Friend ids", ids)
        setState(ids)
    })
}

/***
 * Function that initializes a snapshot listener of the current user's friends collection
 *
 * @param setState Callback function of state to set
 * @returns {Unsubscribe} Unsubscriber called at dismount
 */
export function listenUserCircles(setState) {
    const colRef = collection(db, "users", auth.currentUser.uid, "circles")
    return onSnapshot(colRef, snapshot => {
        let ids = snapshot.docs.map(doc => doc.id)
        console.log("Circle ids", ids)
        setState(ids)
    })
}

/***
 * TESTING FUNCTION: Resets the display name to render the initializeUser screen again
 *
 * @returns {Promise<void>} No return value
 */
export async function resetDisplayName() {
    const user = auth.currentUser;
    try {
        await updateProfile(user, {displayName: ""});
        console.log("profile displayName reset")
    } catch (err) {
        throw err;
    }
}

/***
 * Function that adds each user's id as a document to the other's friend collection. Order of inputs is irrelevant
 *
 * @param user1 uid of first user
 * @param user2 uid of second user
 * @returns {Promise<void>} No return value
 */
export async function friend(user1, user2) {
    const user1Ref = doc(db, `users/${user1}/friends/${user2}`)
    const user2Ref = doc(db, `users/${user2}/friends/${user1}`)
    try {
        await setDoc(user1Ref, {})
        await setDoc(user2Ref, {})
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}

/***
 * Function that removes each user's id as a document to the other's friend collection. Order of inputs is irrelevant.
 * Assumes that the two users entered are friends
 *
 * @param user1 uid of first user
 * @param user2 uid of second user
 * @returns {Promise<void>} No return value
 */
export async function unfriend(user1, user2) {
    const user1Ref = doc(db, 'users', user1, 'friends', user2)
    const user2Ref = doc(db, 'users', user2, 'friends', user1)
    try {
        await deleteDoc(user1Ref)
        await deleteDoc(user2Ref)
    } catch (err) {
        console.warn(err.message);
        throw err;
    }
}


export async function joinCircle(user, circle) {
    const userRef = doc(db, `users/${user}/circles`)
    try {
        await addDoc(circle, {})
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

/***
 * Initializes Auth/Firestore User Display Name, Auth/Firestore photoURL,
 * and Firestore phoneNumber (Auth phoneNumber is not supported on web API as of Jan 2024)
 *
 * @param displayName
 * @param phoneNumber
 * @param photoURL
 * @returns {Promise<void>}
 */
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

export async function getMember(userId) {
    const userRef = doc(db, `users/${userId}`)
    console.log("GET USER", userId)

    try {
        let res = await getDoc(userRef)
        res = res.data()
        res.photo = await parseDownloadURL(res.photoURL)
        return res
    } catch(err) {
        console.log("Get Circle Error:", err)
        throw err;
    }
}

export async function getUserFriends(userId) {
    const friendsCol = collection(db, `users/${userId}/friends`)
    console.log("GET USER FRIENDS", userId)

    try {
        const docs = await getDocs(friendsCol)
        const ids = []
        docs.forEach(doc => ids.push(doc.id))
        return ids
    } catch(err) {
        console.log("Get Circle Error:", err)
        throw err;
    }
}

export async function getUserCircles(userId) {
    const circlesCol = collection(db, `users/${userId}/circles`)
    console.log("GET USER CIRCLES", userId)

    try {
        const docs = await getDocs(circlesCol)
        const ids = []
        docs.forEach(doc => ids.push(doc.id))
        return ids
    } catch (err) {
        console.log("Get Circle Error:", err)
        throw err;
    }
}