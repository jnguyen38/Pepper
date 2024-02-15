import {auth, db} from "./config/config";
import {Timestamp, collection, addDoc, doc, setDoc} from "firebase/firestore";
import {setCircleImage} from "./storage";
import {joinCircle, logUserPost} from "./user";

export async function addCircle(community, title, description, cover, logo, isPublic, attributes) {
    const user = auth.currentUser;

    try {
        const circleRef = await addDoc(collection(db, "circles"), {
            title,
            community,
            description,
            isPublic,
            attributes,
            creationTime: Timestamp.now(),
            managers: [user.uid],
        })
        await setCircleImage(cover, logo, circleRef.id)
        await joinCircle(user.uid, circleRef.id)
        return circleRef.id
    } catch (err) {
        console.warn(err)
        throw err
    }
}

export async function addPost(title, description, media) {
    const user = auth.currentUser;

    try {
        const postRef = await addDoc(collection(db, "posts"), {
            title,
            description,
            media,
            author: user.uid,
            creationTime: Timestamp.now(),
        })
        await logUserPost(user.uid, postRef.id)
        return postRef.id
    } catch(err) {
        console.warn(err)
        throw err
    }
}

export async function addReply(title, description, media, parentId) {
    const postId = await addPost(title, description, media, parent)
    const postDoc = doc(db, `posts/${parentId}/replies/${postId}`)

    try {
        await setDoc(postDoc, {})
    } catch(err) {
        console.warn(err)
        throw err
    }
}
