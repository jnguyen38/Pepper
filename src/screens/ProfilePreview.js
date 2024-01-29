import {Pressable} from "react-native";

import styles from "../styles/modules/main/Profile.module.css";
import {FocusAwareStatusBar} from "../js/util";
import Animated from "react-native-reanimated"


export default function ProfilePreview(props) {
    return (
        <Pressable style={styles.profilePreview} onPress={() => props.navigation.goBack()}>
            <FocusAwareStatusBar barStyle={"light-content"} hidden={true}/>

            <Animated.Image source={{uri: props.route.params.uri}} style={styles.profilePreviewPic}
                            sharedTransitionTag={`image-${props.route.params.tag}`}/>
        </Pressable>
    )
}