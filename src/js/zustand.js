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


export const useTabStore = create((set) => ({
    tab: true,
    setTab: (tab) => set(() => {
        return {tab}
    })
}))