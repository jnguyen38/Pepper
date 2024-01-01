import {Image, View, Text, StatusBar, StyleSheet, Pressable} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/CircleInfo.module.css";
import root from "../styles/Root.module.css";
import Animated, {interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import backArrow from "../../assets/back-arrow.png";
import circles from "../../assets/profile/circlesPurple.png";
import events from "../../assets/events.png";
import reply from "../../assets/reply.png";
import {BackButton} from "../js/util";

const IMG_HEIGHT = 250;

const postData = [
    {
        author: "Matt Long",
        time: "7:41 PM",
        title: "Thoughts on RecSports Futsal league?",
        body: "I have been an avi supporter of Futsal leagues from a young" +
            "age and was wondering if anyone shared a similar passion. I would" +
            "be very interested in starting a league!",
        replies: [
            {
                author: "Jon Nguyen",
                time: "7:42 PM",
                body: "Matt, I have been wanting this for a while! Please do!"
            },
            {
                author: "Lucas Kopp",
                time: "7:44 PM",
                body: "Nobody loves Futsal more than me"
            },
            {
                author: "Cat Pardi",
                time: "7:44 PM",
                body: "Woohoo!"
            }
        ]
    },
    {
        author: "Carson Scott",
        time: "12:25 PM",
        title: "Thoughts on a designated snack guy each game?",
        body: "I have been an avi supporter of Futsal leagues from a young" +
            "age and was wondering if anyone shared a similar passion. I would" +
            "be very interested in starting a league!",
        replies: [
            {
                author: "Ryan O'Halloran",
                time: "1:30 PM",
                body: "Awesome!"
            },
            {
                author: "Peter Ainsworth",
                time: "1:44 PM",
                body: "You would want a snack guy, Carson..."
            },
            {
                author: "Cat Pardi",
                time: "2:02 PM",
                body: "Down!"
            },
            {
                author: "Dennis Hutchison",
                time: "2:03 PM",
                body: "Also down!"
            },
            {
                author: "Tommy McClelland",
                time: "2:05 PM",
                body: "For sure"
            },
            {
                author: "Anna Mittag",
                time: "2:06 PM",
                body: "I'm with Tommy"
            }
        ]
    },
    {
        author: "Jon Nguyen",
        time: "11:16 AM",
        title: "Thoughts on a chess tournament?",
        body: "I have been an avi supporter of Futsal leagues from a young" +
            "age and was wondering if anyone shared a similar passion. I would" +
            "be very interested in starting a league!",
        replies: [
            {
                author: "Ryan O'Halloran",
                time: "1:30 PM",
                body: "No!"
            }
        ]
    }
]

export default function CircleInfoScreen(props) {
    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.5]
                    )
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1]
                    )
                }
            ]
        };
    })

    return (
        <View style={styles.screen}>
            <BackButton {...props}/>

            <Animated.ScrollView ref={scrollRef}
                                 showsVerticalScrollIndicator={false}
                                 scrollEventThrottle={16}>


                <Animated.View style={[styleSheet.imageHolder, imageAnimatedStyle]}>
                    <LinearGradient colors={['#3971f688', '#9028cc88']}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 1, y: 0.5}}
                                    style={[root.linearBackground, {zIndex: 10}]}/>
                    <Image source={props.route.params.background}
                           style={[styles.backgroundImage]}/>
                    <Text style={[text.pItalics, text.white, {zIndex: 10}]}>Notre Dame</Text>
                    <Text style={[text.h1, text.white, {zIndex: 10, textAlign: "center"}]}>{props.route.params.title}</Text>
                </Animated.View>

                <View style={styles.infoContainer}>
                    <View style={styles.info}>
                        <View style={styles.socialInfo}>
                            <Pressable style={styles.socialSection}  onPress={() => props.navigation.push("MembersList", {header: "Members"})}>
                                <Image source={circles} style={styles.socialIcon}/>
                                <Text style={[text.grey, text.h4]}>{props.route.params.members} Members</Text>
                                <Text style={[text.black, text.small]}>12 Friends</Text>
                            </Pressable>
                            <Pressable style={styles.socialSection}>
                                <Image source={events} style={styles.socialIcon}/>
                                <Text style={[text.grey, text.h4]}>3 Events</Text>
                                <Text style={[text.black, text.small]}>1 RSVP</Text>
                            </Pressable>
                        </View>

                        <View style={styles.posts}>
                            <Text style={[text.h2, text.pepper]}>Recent Posts</Text>
                            {postData.map((post, index) =>
                                <Pressable key={index} style={styles.post}>
                                    <Text style={[text.small, text.black]}>{post.author}</Text>
                                    <Text style={[text.h3, text.pepper]}>{post.title}</Text>
                                    <View style={styles.replies}>
                                        <Image source={reply} style={styles.replyIcon}/>
                                        <Text style={[text.fineBold, text.white]}>{post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}</Text>
                                    </View>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                <StatusBar hidden/>
            </Animated.ScrollView>
        </View>
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
    }
})