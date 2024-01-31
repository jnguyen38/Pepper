import {auth, db} from "./config/config";
import {Timestamp, collection, addDoc } from "firebase/firestore";
import {setCircleImage} from "./storage";
import {joinCircle} from "./user";

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
    } catch (err) {
        console.warn(err)
        throw err
    }
}