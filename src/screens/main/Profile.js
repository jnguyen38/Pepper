import {Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {
    BackButton,
    CustomSafeAreaView,
    FocusAwareStatusBar,
    Loading,
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
import circles from "../../../assets/profile/circlesPurple.png";
import followers from "../../../assets/profile/followersPurple.png";
import logout from "../../../assets/profile/logout-slim.png";
import settings from "../../../assets/profile/settings.png";
import privacy from "../../../assets/profile/privacy.png";
import terms from "../../../assets/profile/terms.png";
import {useState} from "react";
import {logoutFirebase} from "../../../server/auth";
import {resetDisplayName} from "../../../server/user";
import {auth} from "../../../server/config/config";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import {setProfilePicture} from "../../../server/storage";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export default function ProfileScreen(props) {
    const [showModal, setShowModal] = useState(false)
    const [authUser] = useState(auth.currentUser)
    const [edited, setEdited] = useState(false)
    const [profilePic, setProfilePic] = useState(undefined)
    const user = props.route.params.user;
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
            console.log(typeof (result.assets[0]))
            // Use profile picture in cache, set profile picture, and invalidate profile query
            setEdited(true)
            await setProfilePicture(result.assets[0].uri, auth.currentUser.uid)
            await queryClient.invalidateQueries({queryKey: ['profile', authUser.uid]})
            await queryClient.invalidateQueries({queryKey: ['user', authUser.uid]})
        }
    }

    function handleLogout() {
        logoutFirebase().then(() => {
        }).catch(err => {
            console.warn(err);
        });
    }

    function handleCreationTime() {
        const arr = user.creationTime.toString().split(" ")
        return `${arr[2]} ${arr[3]}`
    }

    if (!user || profilePictureQuery.isPending) return (
        <Loading/>
    )

    return (
        <View style={[root.statusBar]}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <View style={[styles.profilePic]}>
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

                    <View style={styles.textContainer}>
                        <Text style={[text.h1, text.pepper]} numberOfLines={1} adjustsFontSizeToFit={true}>{user.displayName}</Text>
                        <Text style={[text.p, text.black]}>@{user.username}</Text>
                    </View>

                    <View style={styles.contactInfo}>
                        {user.phoneNumber ? (
                            <View style={styles.infoLine}>
                                <Image source={phone} style={{width: 25, height: 25}}/>
                                <Text style={[text.black, text.p]}>{user.phoneNumber}</Text>
                            </View>
                        ) : null}
                        <View style={styles.infoLine}>
                            <Image source={mail} style={{width: 25, height: 25}}/>
                            <Text style={[text.black, text.p]}>{user.email}</Text>
                        </View>
                        <View style={styles.infoLine}>
                            <Image source={joined} style={{width: 22, height: 25, objectFit: "contain"}}/>
                            <Text style={[text.black, text.p]}>Joined {handleCreationTime()}</Text>
                        </View>
                    </View>

                    <View style={styles.socialInfo}>
                        <TouchableOpacity style={styles.socialSection}
                                          onPress={() => props.navigation.push("Circles", {circles: user.circles})}>
                            <Image source={circles} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{user.circle_count} Circle{user.circle_count === 1 ? "" : "s"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialSection}
                                          onPress={() => props.navigation.push("MembersList", {header: "Friends", friends: user.friends})}>
                            <Image source={followers} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{user.friend_count} Friend{user.friend_count === 1 ? "" : "s"}</Text>
                        </TouchableOpacity>
                    </View>

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
    const [isFriend, setIsFriend] = useState(props.route.params.user.friends.includes(props.route.params.uid))
    const id = Math.random().toString(16).slice(2)

    function handleCreationTime() {
        const arr = props.route.params.creationTime.toString().split(" ")
        return `${arr[2]} ${arr[3]}`
    }

    function handleToggleFriend() {
        setIsFriend(curr => !curr)
    }

    return (
        <View style={[root.statusBar]}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <BackButton safeView={true} {...props}/>

                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <StatusBar barStyle={"dark-content"}/>

                    <View style={styles.profilePic}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => props.navigation.navigate("ProfilePreview", {tag: id, uri: URL.createObjectURL(props.route.params.photo)})}>
                            <Animated.Image source={{uri: URL.createObjectURL(props.route.params.photo)}}
                                            sharedTransitionTag={`image-${id}`}
                                            style={styles.profilePicImg}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[text.h1, text.pepper]} numberOfLines={1} adjustsFontSizeToFit={true}>{props.route.params.displayName}</Text>
                        <Text style={[text.p, text.black]}>@{props.route.params.username}</Text>
                    </View>

                    {props.route.params.uid === auth.currentUser.uid ? null : (
                        <TouchableOpacity style={isFriend ? styles.friend : styles.follow} activeOpacity={0.6}
                                          onPress={() => handleToggleFriend()}>
                            <Text style={[text.p, isFriend ? text.white : text.pepper]}>{isFriend ? "Friends" : "Follow"}</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.contactInfo}>
                        {props.route.params.phoneNumber ? (
                            <View style={styles.infoLine}>
                                <Image source={phone} style={{width: 25, height: 25}}/>
                                <Text style={[text.black, text.p]}>{props.route.params.phoneNumber}</Text>
                            </View>
                        ) : null}
                        <View style={styles.infoLine}>
                            <Image source={mail} style={{width: 25, height: 25}}/>
                            <Text style={[text.black, text.p]}>{props.route.params.email}</Text>
                        </View>
                        <View style={styles.infoLine}>
                            <Image source={joined} style={{width: 22, height: 25, objectFit: "contain"}}/>
                            <Text style={[text.black, text.p]}>Joined {handleCreationTime()}</Text>
                        </View>
                    </View>

                    <View style={styles.socialInfo}>
                        <TouchableOpacity style={styles.socialSection}
                                          onPress={() => props.navigation.push("Circles", {circles: props.route.params.circles})}>
                            <Image source={circles} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{props.route.params.circle_count} Circle{props.route.params.circle_count === 1 ? "" : "s"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialSection}
                                          onPress={() => props.navigation.push("MembersList", {header: "Friends", friends: props.route.params.friends})}>
                            <Image source={followers} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{props.route.params.friend_count} Friend{props.route.params.friend_count === 1 ? "" : "s"}</Text>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}