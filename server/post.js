import {addDoc, collection, doc, getDoc, onSnapshot, Timestamp} from "firebase/firestore";
import {auth, db} from "./config/config";
import {parseDownloadURL} from "../src/js/util";
import {logUserPost} from "./user";
import {addPostToCircle} from "./add";

export async function addPost(circleId, title, description, media) {
    const user = auth.currentUser;

    try {
        const postRef = await addDoc(collection(db, "posts"), {
            title,
            description,
            author: user.uid,
            creationTime: Timestamp.now(),
            replies: []
        })
        await logUserPost(user.uid, postRef.id)
        await addPostToCircle(circleId, postRef.id)
        return postRef.id
    } catch(err) {
        console.warn(err)
        throw err
    }
}

/***
 * Function that initializes a snapshot listener of the current circle's posts collection
 *
 * @param postId
 * @param setState Callback state modifier
 * @returns {Unsubscribe} Unsubscriber called at dismount
 */
export function listenPostReplies(postId, setState) {
    const colRef = collection(db, "posts", postId, "replies")
    return onSnapshot(colRef, snapshot => {
        let ids = snapshot.docs.map(doc => doc.id)
        console.log("Circle ids", ids)
        setState(ids)
    })
}

/***
 * Function that initializes a snapshot listener of the current circle's posts collection
 *
 * @param circleId
 * @param setState Callback state modifier
 * @returns {Unsubscribe} Unsubscriber called at dismount
 */
export function listenCirclePosts(circleId, setState) {
    const colRef = collection(db, "circles", circleId, "posts")
    return onSnapshot(colRef, snapshot => {
        let ids = snapshot.docs.map(doc => doc.id)
        console.log("Post ids", ids)
        setState(ids)
    })
}
export async function getPost(postId) {
    const postRef = doc(db, `posts/${postId}`)
    console.log("GET POST", postId)

    try {
        let res = await getDoc(postRef)
        res = res.data()
        return res
    } catch(err) {
        console.warn("Get Post Error:", err)
        throw err;
    }
}