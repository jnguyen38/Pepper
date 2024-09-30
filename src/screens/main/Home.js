import root from "../../styles/Root.module.css";
import styles from "../../styles/modules/main/Home.module.css"
import text from "../../js/text";
import {
    Dimensions,
    Keyboard, ScrollView, StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import MapView from "react-native-maps";
import {Loading} from "../../js/util";
import {useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

const IMG_HEIGHT = 275;
const SCREEN_HEIGHT = Dimensions.get('window').height

export default function HomeScreen(props) {
    return (
        <View style={root.statusBar}>
            <View style={styles.homeContainer}>
                <TouchableOpacity style={styles.mapContainer} activeOpacity={.92}>
                    <Map {...props}/>
                </TouchableOpacity>
                <EventsListPullOut/>
            </View>
        </View>
    )
}

function Map(props) {
    const location = props.route.params.location;
    const NDLoc = {
        latitude: 41.7002,
        longitude: -86.2379,
        latitudeDelta: 0.03,
        longitudeDelta: 0.015
    }

    if (!location) return (
        <Loading/>
    )

    const myLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    }

    return Object.keys(location).length ? (
        <MapView style={styles.map}
                 showsUserLocation={true}
                 showsCompass={true}
                 showsMyLocationButton={true}
                 initialRegion={myLoc}>
        </MapView>
    ) : (
        <MapView style={styles.map}>
            <View style={[styles.mapOverlay]}>
                <Text style={[text.p, text.grey]}>Please allow location services in settings to enable the map</Text>
            </View>
        </MapView>
    )
}

function EventsListPullOut(props) {
    const translateY = useSharedValue(0)
    const context = useSharedValue({y: 0})
    const snapPoints =  [-115, -350, -SCREEN_HEIGHT + 50]
    const springOptions =  {
        damping: 15,
        mass: 1
    }

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = {y: translateY.value};
        })
        .onUpdate(event =>  {
            translateY.value = event.translationY + context.value.y
            translateY.value = Math.max(translateY.value, snapPoints[snapPoints.length-1])
            translateY.value = Math.min(translateY.value, snapPoints[0])
        })
        .onEnd(event => {
            // Swiping Up, check which snap point it is closest to
            if (event.velocityY < -1000) {
                if (translateY.value > snapPoints[1]) {
                    translateY.value = withSpring(snapPoints[1], springOptions);
                } else {
                    translateY.value = withSpring(snapPoints[2], springOptions);
                }
            }
            // Swiping Down, check which snap point it is closest to
            else if (event.velocityY > 1000) {
                if (translateY.value > snapPoints[1]) {
                    translateY.value = withSpring(snapPoints[0], springOptions);
                } else {
                    translateY.value = withSpring(snapPoints[1], springOptions);
                }
            }
            // Check if the modal is pulled to a specific snap point
            else if (translateY.value > (snapPoints[1] + snapPoints[0])/2) {
                translateY.value = withSpring(snapPoints[0], springOptions);
            } else if (translateY.value > (snapPoints[2] + snapPoints[1])/2) {
                translateY.value = withSpring(snapPoints[1], springOptions);
            } else {
                translateY.value = withSpring(snapPoints[2], springOptions);
            }
        })

    const style = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}]
        }
    })

    useEffect(() => {
        translateY.value = withSpring(snapPoints[0], springOptions)
    }, [])

    function handleTap() {
        if (Keyboard.isVisible()) Keyboard.dismiss()
        if (translateY.value === snapPoints[0]) translateY.value = withSpring(snapPoints[1], springOptions);
        if (translateY.value === snapPoints[1]) translateY.value = withSpring(snapPoints[2], springOptions);
    }

    return (
        <GestureDetector gesture={pan}>
            <TouchableWithoutFeedback onPress={handleTap}>
                <Animated.View style={[styleSheet.addPostContainer, style, styles.tongueShadow]}>
                    <View style={styles.handle}/>
                    <ScrollView style={styles.tongueContainer}
                                pointerEvents={"none"}>

                    </ScrollView>
                </Animated.View>
            </TouchableWithoutFeedback>
        </GestureDetector>
    )
}


const styleSheet = StyleSheet.create({
    imageHolder: {
        width: "100%",
        height: IMG_HEIGHT,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    addPostContainer: {
        width: "100%",
        minHeight: SCREEN_HEIGHT,
        position: "absolute",
        top: SCREEN_HEIGHT,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 10,
        backgroundColor: "#FFFFFF",
        padding: 12,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center"
    }
})