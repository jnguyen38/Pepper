import {
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/CircleInfo.module.css";
import root from "../styles/Root.module.css";
import Animated, {
    interpolate, Keyframe,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {LinearGradient} from "expo-linear-gradient";
import circlesImg from "../../assets/profile/circlesPurple.png";
import events from "../../assets/events.png";
import reply from "../../assets/reply.png";
import {BackButton, FocusAwareStatusBar, Loading} from "../js/util";
import settings from "../../assets/settings-white.png"
import add from "../../assets/add-circle-white.png"
import check from "../../assets/check-circle-white.png"
import {auth} from "../../server/config/config";
import {useEffect, useState} from "react";
import {useCircleStore, useFriendStore} from "../js/zustand";
import {useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {getCircleMembers, getMember, getUser, joinCircle, leaveCircle} from "../../server/user";
import {addPost, getPost, listenCirclePosts} from "../../server/post";

const IMG_HEIGHT = 275;
const SCREEN_HEIGHT = Dimensions.get('window').height
const MODAL_HEIGHT = -SCREEN_HEIGHT + 150

export default function CircleInfoScreen(props) {
    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const circles = useCircleStore(s => s.circles);
    const friends = useFriendStore(s => s.friends);
    const circleId = props.route.params.id
    const [isMember, setIsMember] = useState(circles.includes(circleId))
    const [postIds, setPostIds] = useState(undefined)
    const [posts, setPosts] = useState(undefined)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const queryClient = useQueryClient()

    const membersQuery = useQuery({
        queryKey: ["members", circleId],
        queryFn: async () => await getCircleMembers(circleId)
    })

    const postQueries = useQueries({
        queries: postIds ? postIds.map((postId) => {
            return {
                queryKey: ['post', postId],
                queryFn: async () =>  {
                    console.log("Running posts")
                    return await getPost(postId)
                },
            }
        }) : []
    })

    const allFinished = postQueries.every(query => query.isSuccess && query.isFetched)

    useEffect( () => {
        if (allFinished && postIds) {
            let data = postQueries
                .map(data => data.data)
                .sort((a, b) => b.creationTime.seconds - a.creationTime.seconds)
            setPosts(data)
        }
    }, [allFinished, postIds])

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
        return listenCirclePosts(circleId, setPostIds)
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
            {showConfirmation && <Confirmation setShowConfirmation={setShowConfirmation}/>}
            {isMember && <AddPost circleId={circleId} setShowConfirmation={setShowConfirmation}/>}

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
                    <TouchableOpacity style={isMember ? styles.joined : styles.join} activeOpacity={0.8}
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
                        {posts ? posts.length ? posts.map((post, index) => <Post key={index} post={post} {...props}/>) :
                            <View style={styles.notFound}>
                                <Text style={[text.h4, text.lightgrey]}>No Posts Found</Text>
                            </View> :
                            <Loading size={"small"}/>}
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    )
}

function Post(props) {
    const post = props.post

    const userQuery = useQuery({
        queryKey: ['user', post.author],
        queryFn: async () => await getMember(post.author)
    })

    if (userQuery.isLoading) return (
        <TouchableOpacity style={styles.post} activeOpacity={0.8}>
            <View style={styles.postText}>
                <Text style={[text.h3, text.pepper]}>{post.title}</Text>
            </View>
            <View style={styles.replies}>
                <Image source={reply} style={styles.replyIcon}/>
                <Text style={[text.fineBold, text.white]}>replies</Text>
            </View>
        </TouchableOpacity>
    )



    return (
        <TouchableOpacity style={styles.post} activeOpacity={0.8} onPress={props.navigation.push("Post", props.post)}>
            <View style={styles.postText}>
                <Text style={[text.small, text.black]}>{userQuery.data.displayName}</Text>
                <Text style={[text.h3, text.pepper]}>{post.title}</Text>
            </View>
            <View style={styles.replies}>
                <Image source={reply} style={styles.replyIcon}/>
                <Text style={[text.fineBold, text.white]}>replies</Text>
            </View>
        </TouchableOpacity>
    )
}

function Confirmation(props) {
    const duration = 3000;
    const [t, setT] = useState(false)
    const enteringAnimation = new Keyframe({
        0: {opacity: 0},
        20: {opacity: 1},
        80: {opacity: 1},
        100: {opacity: 0}
    })

    useEffect(() => {
        setTimeout(() => {props.setShowConfirmation(false)}, duration)
    }, [])

    return (
        <Animated.View style={styles.confirmation} entering={enteringAnimation.duration(duration)}>
            <Image source={check} style={styles.confirmationImage}/>
            <Text style={[text.h4, text.white]}
                  suppressHighlighting={true} >Post Added!</Text>
        </Animated.View>
    )
}

function AddPost(props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const translateY = useSharedValue(0)
    const context = useSharedValue({y: 0})

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = {y: translateY.value};
        })
        .onUpdate(event =>  {
            translateY.value = event.translationY + context.value.y
            translateY.value = Math.max(translateY.value, MODAL_HEIGHT)
            translateY.value = Math.min(translateY.value, -145)
        })
        .onEnd(event => {
            const duration = Math.max(400 / (Math.abs(event.velocityY)/1500), 200)
            if (event.velocityY < -750) {
                translateY.value = withTiming(MODAL_HEIGHT, {duration: duration});
            } else if (event.velocityY > 750) {
                translateY.value = withTiming(-145, {duration: duration});
            } else if (translateY.value > (MODAL_HEIGHT + -145)/2) {
                translateY.value = withTiming(-145);
            } else {
                translateY.value = withTiming(MODAL_HEIGHT);
            }
        })

    const style = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}]
        }
    })

    useEffect(() => {
        translateY.value = withTiming(-145)
    }, [])

    useEffect(() => {
        setDisabled(!title)
    }, [title])

    function handleTap() {
        if (Keyboard.isVisible()) Keyboard.dismiss()
        if (translateY.value === -145) translateY.value = withTiming(MODAL_HEIGHT, {duration: 400});
    }

    function handleSubmit() {
        setLoading(true)
        addPost(props.circleId, title, description, undefined).then(id => {
            console.log("POST CREATED", id)
            setLoading(false)
            Keyboard.dismiss()
            translateY.value = withTiming(-145)
            setTitle("")
            setDescription("")
            props.setShowConfirmation(true)
        }).catch(err => {
            setLoading(false)
            console.warn(err)
        })
    }

    return (
        <GestureDetector gesture={pan}>
            <TouchableWithoutFeedback onPress={handleTap}>
                <Animated.View style={[styleSheet.addPostContainer, style]} onTouchMove={() => Keyboard.dismiss()}>
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
                        <View style={styles.addLabels}>
                            <Text style={[text.smallBoldItalics, text.white]}>Description <Text style={[text.smallItalics, text.white]}>(Optional)</Text></Text>
                            <TextInput style={styles.addDescriptionInput}
                                       keyboardAppearance={'light'}
                                       placeholder={"Explain a little..."}
                                       placeholderTextColor={"#6464f6"}
                                       value={description}
                                       maxLength={1024}
                                       numberOfLines={10}
                                       multiline={true}
                                       onSelectionChange={e => e.stopPropagation()}
                                       onChangeText={text => setDescription(text)}/>
                        </View>
                        <TouchableOpacity style={[styles.addButton, disabled ? styles.disabledButton : styles.activeButton]}
                                          onPress={handleSubmit}
                                          activeOpacity={0.8} disabled={disabled}>
                            {loading ? <Loading size={"small"}/> : <Text style={[text.pBold, disabled ? text.disabled : text.pepper]}>Add Post</Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 80}}></View>
                </Animated.View>
            </TouchableWithoutFeedback>
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