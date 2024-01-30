import {create} from 'zustand';

export const useFriendStore = create((set) => ({
    friends: [],
    setFriends: (friends) => set(() => {
        return {friends}
    })
}))

export const useCircleStore = create((set) => ({
    circles: [],
    setCircles: (circles) => set(() => {
        return {circles}
    })
}))
