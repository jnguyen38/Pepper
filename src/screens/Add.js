import {Dimensions, StatusBar, Text, TextInput, View, Image} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/Add.module.css";
import root from "../styles/Root.module.css";
import {CustomSafeAreaView} from "../js/util";
import arrow from "../../assets/back-arrow.png"
import {LinearGradient} from "expo-linear-gradient";
import Animated, {
    Extrapolate,
    interpolate, interpolateColor,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SECTION_WIDTH = SCREEN_WIDTH - 40;

export default function AddScreen(props) {
    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const dots = [0, 1, 2];

    return (
        <View style={root.statusBar}>
            <LinearGradient colors={["#1b7dea", '#822cd2']}
                            start={{x:0, y:0.6}}
                            end={{x:1, y:0.4}}
                            style={root.linearBackground}/>
            <StatusBar barStyle={"light-content"}/>
            <CustomSafeAreaView>
                <View style={styles.container}>
                    <Animated.ScrollView contentContainerStyle={styles.scrollView}
                                         scrollEventThrottle={16}
                                         ref={scrollRef}
                                         horizontal
                                         pagingEnabled
                                         snapToAlignment={"center"}>
                        <AddCircle/>
                        <AddEvent/>
                        <AddPost/>
                    </Animated.ScrollView>

                    <View style={styles.dotContainer}>
                        {dots.map(dot => {
                            const inputRange = [(dot - 1) * SCREEN_WIDTH, dot * SCREEN_WIDTH, (dot + 1) * SCREEN_WIDTH]
                            const animatedStyle = useAnimatedStyle(() => {
                                return {
                                    width: interpolate(
                                        scrollOffset.value,
                                        inputRange,
                                        [12, 30, 12],
                                        Extrapolate.CLAMP
                                    ),
                                    backgroundColor: interpolateColor(
                                        scrollOffset.value,
                                        inputRange,
                                        ["#ffffff66", "#fff", "#ffffff66"],
                                    )
                                }
                            })

                            return (
                                <Animated.View key={dot} style={[styles.dot, animatedStyle]}/>
                            )
                        })}
                    </View>
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

function Dot(props) {
}

function AddCircle(props) {
    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create a Circle</Text>
            <TextInput style={styles.textInput}/>
            <TextInput style={styles.textInput}/>
        </View>
    )
}

function AddPost(props) {
    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create a Post</Text>
        </View>
    )
}

function AddEvent(props) {
    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create an Event</Text>
        </View>
    )
}