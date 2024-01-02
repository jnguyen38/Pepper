import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import text from "../../js/text";
import styles from "../../styles/modules/main/Circles.module.css";
import root from "../../styles/Root.module.css";
import bengalBouts from "../../../assets/bengalBouts.jpeg";
import pickupSoccer from "../../../assets/pickupSoccer.webp";
import sibc from "../../../assets/sibc.webp";
import rugby from "../../../assets/rugby.png";
import engineers from "../../../assets/engineers.jpeg";
import climb from "../../../assets/climb.jpeg";
import {BackButton, CustomSafeAreaView, FocusAwareStatusBar, nFormatter} from "../../js/util";
import {useEffect} from "react";

const circles = [
    {
        title: "Pickup Soccer",
        members: 22,
        id: 0,
        background: pickupSoccer
    },
    {
        title: "Bengal Bouts",
        members: 438,
        id: 1,
        background: bengalBouts
    },
    {
        title: "SIBC",
        members: 1230,
        id: 2,
        background: sibc
    },
    {
        title: "Climbing Club",
        members: 2491,
        id: 3,
        background: climb
    },
    {
        title: "Rugby Club",
        members: 230,
        id: 4,
        background: rugby
    },
    {
        title: "Engineering Without Borders",
        members: 130,
        id: 5,
        background: engineers
    }
]

export default function ExploreCircleScreen(props) {
    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <View style={styles.explore}>
                        <LinearGradient colors={['#3971f6', '#9028cc']}
                                        start={{x: 0, y: 1}}
                                        end={{x: 1, y: 0}}
                                        style={[root.linearBackground, root.rounded10]}/>

                        <Text style={[text.h1, text.white]}>Explore circles</Text>
                        <Text style={[text.p, text.white]}>See what your friends are up to</Text>
                    </View>

                    <Content {...props}/>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export function CircleScreen(props) {
    return (
        <View style={root.statusBar}>
            <CustomSafeAreaView>
                <BackButton safeView={true} light={true} {...props}/>

                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <Content {...props}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}

function Content(props) {
    return (
        <View style={styles.circles}>
            {circles.map((item, index) => (
                <View style={styles.circle} key={index}>
                    <Image source={item.background} style={styles.circleImage}/>

                    <LinearGradient colors={['#3971f6aa', '#9028ccaa']}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 0}}
                                    style={[root.linearBackground, root.rounded10]}/>

                    <TouchableOpacity style={styles.circleText} activeOpacity={0.8}
                               onPress={() => props.navigation.push("CircleInfo", item)}>
                        <Text style={[text.h1, text.white, {textAlign: "center"}]}>{item.title}</Text>
                        <Text style={[text.p, text.white]}>{nFormatter(item.members, 1)} members</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    )
}