import {
    Dimensions,
    Easing,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/CircleInfo.module.css";
import root from "../styles/Root.module.css";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import circlesImg from "../../assets/profile/circlesPurple.png";
import events from "../../assets/events.png";
import reply from "../../assets/reply.png";
import {BackButton, FocusAwareStatusBar, Loading} from "../js/util";
import settings from "../../assets/settings-white.png"
import add from "../../assets/add-circle-white.png"
import {auth} from "../../server/config/config";
import {useEffect, useState} from "react";
import {useCircleStore, useFriendStore} from "../js/zustand";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getCircleMembers, joinCircle, leaveCircle} from "../../server/user";
import {listenCirclePosts} from "../../server/post";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

const IMG_HEIGHT = 275;
const SCREEN_HEIGHT = Dimensions.get('window').height


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
    const circles = useCircleStore(s => s.circles);
    const friends = useFriendStore(s => s.friends);
    const circleId = props.route.params.id
    const [isMember, setIsMember] = useState(circles.includes(circleId))
    const [posts, setPosts] = useState(undefined)
    const queryClient = useQueryClient()

    const membersQuery = useQuery({
        queryKey: ["members", circleId],
        queryFn: async () => await getCircleMembers(circleId)
    })

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

    async function handleToggleJoin() {
        const tempIsMember = isMember
        setIsMember(curr => !curr)

        if (tempIsMember) {
            await leaveCircle(auth.currentUser.uid, circleId)
        } else {
            await joinCircle(auth.currentUser.uid, circleId)
        }

        await queryClient.invalidateQueries({queryKey: ['members', circleId]})
    }

    useEffect(() => {
        const unsubscribePosts = listenCirclePosts(circleId, setPosts)
        return unsubscribePosts
    }, [])

    useEffect(() => {
        setIsMember(circles.includes(circleId))
    }, [circles])

    if (!membersQuery)
        return <Loading/>

    const mutualFriends = friends.filter(friend => membersQuery.data.includes(friend));

    return (
        <View style={styles.screen}>
            <BackButton {...props}/>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={true} animated={false}/>

            {isMember && <AddPost/>}

            <Animated.ScrollView ref={scrollRef}
                                 contentContainerStyle={styles.scrollView}
                                 showsVerticalScrollIndicator={false}
                                 scrollEventThrottle={16}>


                <Animated.View style={[styleSheet.imageHolder, imageAnimatedStyle]}>
                    <LinearGradient colors={['#3971f688', '#9028cc88']}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 1, y: 0.5}}
                                    style={[root.linearBackground, {zIndex: 10}]}/>
                    <Image source={{uri: URL.createObjectURL(props.route.params.cover)}} style={[styles.backgroundImage]}/>
                    <Text style={[text.pItalics, text.white, {zIndex: 10}]}>{props.route.params.community}</Text>
                    <Text style={[text.h1, text.white, {zIndex: 10, textAlign: "center"}]}>{props.route.params.title}</Text>
                    <TouchableOpacity style={isMember ? styles.joined : styles.join} activeOpacity={0.6}
                                      onPress={() => handleToggleJoin()}>
                        <Text style={[text.descRegular, isMember ? text.white : text.pepper]}>{isMember ? "Member" : "Join"}</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.infoContainer}>
                    <View style={styles.socialInfo}>
                        <TouchableOpacity style={styles.socialSection} activeOpacity={0.8}
                                          onPress={() => props.navigation.push("MembersList", {header: "Members", friends: membersQuery.data})}>
                            <Image source={circlesImg} style={styles.socialIcon}/>
                            <Text style={[text.grey, text.h4]}>{membersQuery.data.length} Member{membersQuery.data.length === 1 ? "":"s"}</Text>
                            <Text style={[text.black, text.small]}>{mutualFriends.length} Friend{mutualFriends.length === 1 ? "":"s"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialSection} activeOpacity={0.8}
                                          onPress={() => props.navigation.push("EventsList")}>
                            <Image source={events} style={styles.socialIcon}/>
                            <Text style={[text.grey, text.h4]}>{props.route.params.active_events_count} Event{props.route.params.active_events_count === 1 ? "":"s"}</Text>
                            <Text style={[text.black, text.small]}>1 RSVP</Text>
                        </TouchableOpacity>
                    </View>

                    {props.route.params.managers.includes(auth.currentUser.uid) ? (
                        <Manager {...props}/>
                    ) : null}

                    <View style={styles.description}>
                        <Text style={[text.h2, text.pepper]}>Description</Text>
                        <Text style={[text.desc, text.grey, {marginLeft: 20}]}>{props.route.params?.description}</Text>
                    </View>

                    <View style={styles.posts}>
                        <Text style={[text.h2, text.pepper]}>Recent Posts</Text>
                        {postData.map((post, index) =>
                            <TouchableOpacity key={index} style={styles.post} activeOpacity={0.8}>
                                <View style={styles.postText}>
                                    <Text style={[text.small, text.black]}>{post.author}</Text>
                                    <Text style={[text.h3, text.pepper]}>{post.title}</Text>
                                </View>
                                <View style={styles.replies}>
                                    <Image source={reply} style={styles.replyIcon}/>
                                    <Text style={[text.fineBold, text.white]}>{post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    )
}

function AddPost() {
    const [title, setTitle] = useState("")
    const translateY = useSharedValue(0)
    const context = useSharedValue({y: 0})

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = {y: translateY.value}
        })
        .onUpdate(event =>  {
            translateY.value = event.translationY + context.value.y
            translateY.value = Math.max(translateY.value, -SCREEN_HEIGHT + IMG_HEIGHT - 22)
            translateY.value = Math.min(translateY.value, -145)
        })
        .onEnd(event => {
            const duration = 300 / (Math.abs(event.velocityY)/1500)
            if (event.velocityY < -750) {
                translateY.value = withTiming(-SCREEN_HEIGHT + IMG_HEIGHT - 22, {duration: duration});
            } else if (event.velocityY > 750) {
                translateY.value = withTiming(-145, {duration: duration});
            } else if (translateY.value > (-SCREEN_HEIGHT + IMG_HEIGHT - 22 + -145)/2) {
                translateY.value = withTiming(-145);
            } else {
                translateY.value = withTiming(-SCREEN_HEIGHT + IMG_HEIGHT - 22);
            }
        })

    const sheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}]
        }
    })

    useEffect(() => {
        translateY.value = withTiming(-145)
    }, [])

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styleSheet.addPostContainer, sheetStyle]} onTouchStart={() => Keyboard.dismiss()}>
                <LinearGradient colors={['#3971f6', '#9028cc']}
                                start={{x: 0, y: 0.5}}
                                end={{x: 1, y: 0.5}}
                                style={[root.linearBackground, styles.addPostBorders]}/>
                <View style={styles.addPost}>
                    <View style={styles.line}/>
                    <View style={styles.row}>
                        <Image source={add} style={styles.addIcon}/>
                        <Text style={[text.h4, text.white]}>Add a Post</Text>
                    </View>
                    <View style={styles.addLabels}>
                        <Text style={[text.smallBoldItalics, text.white]}>Title <Text style={[text.smallItalics, text.white]}>(Required)</Text></Text>
                        <TextInput style={styles.addTitleInput}
                                   keyboardAppearance={'light'}
                                   placeholder={"What's on your mind?"}
                                   placeholderTextColor={"#6464f6"}
                                   value={title}
                                   maxLength={256}
                                   onChangeText={text => setTitle(text)}/>

                    </View>
                </View>
                <View style={{height: 80}}></View>
            </Animated.View>
        </GestureDetector>

    )
}

function Manager() {
    return (
        <View style={styles.manageGradient}>
            <LinearGradient colors={['#3942f6', '#6a28cc']}
                            start={{x: 0, y: 0.5}}
                            end={{x: 1, y: 0.5}}
                            style={[root.linearBackground, {zIndex: 10}]}/>
            <View style={styles.manage}>
                <View style={styles.manageLine}>
                    <Image source={settings} style={styles.manageIcon}/>
                    <Text style={[text.h2, text.white]}>Manage</Text>
                </View>
            </View>
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
    },
    addPostContainer: {
        width: "100%",
        height: SCREEN_HEIGHT,
        position: "absolute",
        top: SCREEN_HEIGHT,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 10,
    }
})