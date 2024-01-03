import {atom} from "recoil";

export const authState = atom({
    key: 'auth',
    default: false
});

export const tabState = atom({
    key: 'tab',
    default: 0
});

export const locationState = atom({
    key: 'location',
    default: {}
});

export const initializingFirebase = atom({
    key: 'initializing',
    default: true
});

export const userState = atom({
    key: 'user',
    default: null
});