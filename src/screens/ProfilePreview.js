import {Pressable} from "react-native";

import styles from "../styles/modules/main/Profile.module.css";
import {FocusAwareStatusBar} from "../js/util";
import Animated from "react-native-reanimated"
import {useEffect} from "react";
import {useTabStore} from "../js/zustand";


export default function ProfilePreview(props) {
    const setTab = useTabStore(s => s.setTab)

    useEffect(() => {
        setTab(false)
    })

    function handleGoBack() {
        setTab(true)
        props.navigation.goBack()
    }

    return (
        <Pressable style={styles.profilePreview} onPress={handleGoBack}>
            <FocusAwareStatusBar barStyle={"light-content"} hidden={true}/>

            <Animated.Image source={{uri: props.route.params.uri}} style={styles.profilePreviewPic}
                            sharedTransitionTag={`image-${props.route.params.tag}`}/>
        </Pressable>
    )
}