import {collection, onSnapshot} from "firebase/firestore";
import {db} from "./config/config";

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
        console.log("Circle ids", ids)
        setState(ids)
    })
}