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