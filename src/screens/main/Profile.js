import {Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {
    BackButton,
    CustomSafeAreaView,
    FocusAwareStatusBar,
    Loading,
    ParagraphText,
    parseDownloadURL,
    PROFILE_QUALITY
} from "../../js/util";
import {LinearGradient} from "expo-linear-gradient";

import styles from "../../styles/modules/main/Profile.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import edit from "../../../assets/profile/edit.png";
import phone from "../../../assets/profile/phone.png";
import mail from "../../../assets/profile/mail.png";
import joined from "../../../assets/profile/joined.png";
import circlesImg from "../../../assets/profile/circlesPurple.png";
import followers from "../../../assets/profile/followersPurple.png";
import logout from "../../../assets/profile/logout-slim.png";
import settings from "../../../assets/profile/settings.png";
import privacy from "../../../assets/profile/privacy.png";
import terms from "../../../assets/profile/terms.png";
import {useCallback, useEffect, useState} from "react";
import {logoutFirebase} from "../../../server/auth";
import {friend, getUserCircles, getUserFriends, resetDisplayName, unfriend} from "../../../server/user";
import {auth} from "../../../server/config/config";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import {setProfilePicture} from "../../../server/storage";
import Animated from "react-native-reanimated";
import {useCircleStore, useFriendStore} from "../../js/zustand";

export default function ProfileScreen(props) {
    const [authUser] = useState(auth.currentUser)
    const [edited, setEdited] = useState(false)
    const [profilePic, setProfilePic] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false)
    const user = props.route.params.user;
    const circles = useCircleStore(s => s.circles)
    const friends = useFriendStore(s => s.friends)
    const queryClient = useQueryClient();

    const profilePictureQuery = useQuery({
        queryKey: ['profile', authUser.uid],
        queryFn: async () => {
            setEdited(false)
            return await parseDownloadURL(authUser.photoURL)
        }
    })

    async function pickImage() {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: PROFILE_QUALITY,
        })

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri)

            // Use profile picture in state, set profile picture, and invalidate profile query
            setEdited(true)
            await setProfilePicture(result.assets[0].uri, auth.currentUser.uid)
            await queryClient.invalidateQueries({queryKey: ['profile', authUser.uid]})
            await queryClient.invalidateQueries({queryKey: ['user', authUser.uid]})
        }
    }

    function handleLogout() {
        logoutFirebase().then().catch(err => {
            console.warn(err);
        });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    if (!user || profilePictureQuery.isPending)
        return <Loading/>

    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
                            }>
                    <View style={styles.profilePic}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => props.navigation.navigate("ProfilePreview", {tag: "profile", uri: edited ? profilePic : URL.createObjectURL(profilePictureQuery.data)})}>
                            <Animated.Image source={{uri: edited ? profilePic : URL.createObjectURL(profilePictureQuery.data)}}
                                            sharedTransitionTag={`image-profile`}
                                            style={styles.profilePicImg}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.edit} onPress={pickImage} activeOpacity={0.8}>
                            <LinearGradient colors={['#3a6cf0', '#652cd2']}
                                            start={{x: 1, y: 1}}
                                            end={{x: 0, y: 0}}
                                            style={[root.linearBackground, root.roundedHalf]}/>
                            <Image source={edit} style={styles.editIcon}/>
                        </TouchableOpacity>
                    </View>

                    <UsernameInfo user={user}/>

                    <ContactInfo user={user}/>

                    <SocialInfo circles={circles} friends={friends} {...props}/>

                    <View style={styles.optionContainer}>
                        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
                            <Image source={terms} style={[{width: 35, height: 25, objectFit: "contain"}]}/>
                            <Text style={[text.h3, text.pepper]}>Terms & Conditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} activeOpacity={0.7}>
                            <Image source={privacy} style={[{width: 35, height: 25}]}/>
                            <Text style={[text.h3, text.pepper]}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} activeOpacity={0.7}
                                          onPress={() => resetDisplayName()}>
                            <Image source={settings} style={[{width: 35, height: 25}]}/>
                            <Text style={[text.h3, text.pepper]}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.option]} activeOpacity={0.5}
                                          onPress={handleLogout}>
                            <Image source={logout} style={[{width: 35, height: 25, objectFit: "contain"}]}/>
                            <Text style={[text.h3, text.red]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export function OtherProfileScreen(props) {
    const friends = useFriendStore(s => s.friends)
    const currentUserUid = auth.currentUser.uid;
    const user = props.route.params.user;
    const sharedElementId = Math.random().toString(16).slice(2)
    const queryClient = useQueryClient()
    const [refreshing, setRefreshing] = useState(false)
    const [isFriend, setIsFriend] = useState(friends.includes(user.uid))

    const friendQuery = useQuery({
        queryKey: ['friends', user.uid],
        queryFn: async () => await getUserFriends(user.uid)
    })

    const circleQuery = useQuery({
        queryKey: ['circles', user.uid],
        queryFn: async () => await getUserCircles(user.uid)
    })

    async function handleToggleFriend(){
        const tempIsFriend = isFriend
        setIsFriend(curr => !curr)

        if (tempIsFriend) {
            await unfriend(currentUserUid, user.uid)
        } else {
            await friend(currentUserUid, user.uid)
        }

        await queryClient.invalidateQueries({queryKey: ["friends", user.uid]})
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    useEffect(() => {
        setIsFriend(friends.includes(user.uid))
    }, [friends])

    if (friendQuery.isLoading || circleQuery.isLoading)
        return <Loading/>

    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <BackButton safeView={true} {...props}/>

                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
                            }>
                    <StatusBar barStyle={"dark-content"}/>

                    <View style={styles.profilePic}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => props.navigation.navigate("ProfilePreview", {tag: sharedElementId, uri: URL.createObjectURL(props.route.params.photo)})}>
                            <Animated.Image source={{uri: URL.createObjectURL(user.photo)}}
                                            sharedTransitionTag={`image-${sharedElementId}`}
                                            style={styles.profilePicImg}/>
                        </TouchableOpacity>
                    </View>

                    <UsernameInfo user={user}/>

                    {user.uid === currentUserUid ? null : (
                        <TouchableOpacity style={isFriend ? styles.friend : styles.follow} activeOpacity={0.6}
                                          onPress={() => handleToggleFriend()}>
                            <Text style={[text.p, isFriend ? text.white : text.pepper]}>{isFriend ? "Friends" : "Follow"}</Text>
                        </TouchableOpacity>
                    )}

                    <ContactInfo user={user}/>

                    <SocialInfo circles={circleQuery.data} friends={friendQuery.data} {...props}/>

                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}

function UsernameInfo(props) {
    const user = props.user;

    return (
        <View style={styles.textContainer}>
            <Text style={[text.h1, text.pepper]} numberOfLines={1} adjustsFontSizeToFit={true}>{user.displayName}</Text>
            <ParagraphText>@{user.username}</ParagraphText>
        </View>
    )
}

function ContactInfo(props) {
    const user = props.user;

    function handleCreationTime() {
        const arr = user.creationTime.toString().split(" ")
        return `${arr[2]} '${arr[3].slice(2)}`
    }

    return (
        <View style={styles.contactInfo}>
            {user.phoneNumber ? (
                <View style={styles.infoLine}>
                    <Image source={phone} style={{width: 25, height: 25}}/>
                    <ParagraphText>{user.phoneNumber}</ParagraphText>
                </View>
            ) : null}
            <View style={styles.infoLine}>
                <Image source={mail} style={{width: 25, height: 25}}/>
                <ParagraphText>{user.email}</ParagraphText>
            </View>
            <View style={styles.infoLine}>
                <Image source={joined} style={{width: 22, height: 25, objectFit: "contain"}}/>
                <ParagraphText>Joined {handleCreationTime()}</ParagraphText>
            </View>
        </View>
    )
}

function SocialInfo(props) {
    const friends = props.friends;
    const circles = props.circles;

    return (
        <View style={styles.socialInfo}>
            <TouchableOpacity style={styles.socialSection}
                              onPress={() => props.navigation.push("Circles", {circles})}>
                <Image source={circlesImg} style={styles.socialIcon}/>
                <Text style={[text.pepper, text.h4]}>{circles.length} Circle{circles.length === 1 ? "" : "s"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialSection}
                              onPress={() => props.navigation.push("MembersList", {header: "Friends", friends})}>
                <Image source={followers} style={styles.socialIcon}/>
                <Text style={[text.pepper, text.h4]}>{friends.length} Friend{friends.length === 1 ? "" : "s"}</Text>
            </TouchableOpacity>
        </View>
    )
}