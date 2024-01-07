import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "./config/config";
import {Platform} from "react-native";
import * as FileSystem from "expo-file-system";


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

