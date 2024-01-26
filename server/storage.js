import {getDownloadURL, ref, uploadBytes, getBlob} from "firebase/storage";
import {storage} from "./config/config";
import {Platform} from "react-native";
import * as FileSystem from "expo-file-system";
import {parseDownloadURL} from "../src/js/util";

export async function getCircleLogo(id) {
    const circleRef = ref(storage, `circles/${id}-logo`)
    try {
        const downloadURL = await getDownloadURL(circleRef)
        return await parseDownloadURL(downloadURL)
    } catch (err) {
        console.warn(err)
        throw err
    }
}

export async function getCircleCover(id) {
    const circleRef = ref(storage, `circles/${id}-cover`)
    try {
        const downloadURL = await getDownloadURL(circleRef)
        return await parseDownloadURL(downloadURL)
    } catch (err) {
        console.warn(err)
        throw err
    }
}

export async function setProfilePicture(uri, uid) {
    const storageRef = ref(storage, `profiles/${uid}`);

    try {
        // Hacky workaround for RN/iOS file compression
        // TLDR; iOS caches full image size when RN tries to compress using image-picker
        //       so this redirects the file to upload to the cached RN version instead
        let arr = uri.toString().split("/")
        let fileName = arr[arr.length - 1]
        console.log(fileName)
        if (Platform.OS === 'ios') {
            const originalUri = uri;
            uri = `${FileSystem.documentDirectory}resumableUploadManager-${fileName}.toupload`;
            await FileSystem.copyAsync({ from: originalUri, to: uri });
        }

        let blob = new Blob([await (await fetch(uri)).blob()], { type: 'image/jpeg' });

        const snapshot = await uploadBytes(storageRef, blob);
        console.log('Uploaded a blob or file!');
        console.log("Snapshot", snapshot);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL);

        return downloadURL;
    } catch(err) {
        console.warn(err);
        throw err;
    }
}

export async function setCircleImage(cover, logo, uid) {
    const coverRef = ref(storage, `circles/${uid}-cover`);
    const logoRef = ref(storage, `circles/${uid}-logo`);

    try {
        let arr = cover.toString().split("/")
        let coverName = arr[arr.length - 1]
        arr = logo.toString().split("/")
        let logoName = arr[arr.length - 1]
        if (Platform.OS === 'ios') {
            const originalCover = cover;
            const originalLogo = logo;
            cover = `${FileSystem.documentDirectory}resumableUploadManager-${coverName}.toupload`;
            logo = `${FileSystem.documentDirectory}resumableUploadManager-${logoName}.toupload`;
            await FileSystem.copyAsync({ from: originalCover, to: cover });
            await FileSystem.copyAsync({ from: originalLogo, to: logo });
        }

        let coverBlob = new Blob([await (await fetch(cover)).blob()], { type: 'image/jpeg' });
        let logoBlob = new Blob([await (await fetch(logo)).blob()], { type: 'image/jpeg' });

        const coverSnapshot = await uploadBytes(coverRef, coverBlob);
        const logoSnapshot = await uploadBytes(logoRef, logoBlob);
    } catch(err) {
        console.warn(err);
        throw err;
    }
}

