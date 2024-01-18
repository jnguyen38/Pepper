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
            member_count: 1,
            members: [user.uid],
            active_events_count: 0,
            active_events: [],
            past_events_count: 0,
            past_events: [],
            post_count: 0,
            posts: []
        })
        await setCircleImage(cover, logo, circleRef.id)
        await joinCircle(user.uid, circleRef.id)
    } catch (err) {
        console.warn(err)
        throw err
    }
}