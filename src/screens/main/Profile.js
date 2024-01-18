import {Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {BackButton, CustomSafeAreaView, FocusAwareStatusBar, Loading} from "../../js/util";
import {LinearGradient} from "expo-linear-gradient";

import styles from "../../styles/modules/main/Profile.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import profilePic from "../../../assets/brand/pepper-purple-app-icon.png";
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
import {useEffect, useState} from "react";
import {logoutFirebase} from "../../../server/auth";
import {resetDisplayName} from "../../../server/user";
import {auth} from "../../../server/config/config";

export default function ProfileScreen(props) {
    const [showModal, setShowModal] = useState(false);
    const [authUser] = useState(auth.currentUser)
    const [image, setImage] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const user = props.route.params.user;

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

    async function handleFetchUserData() {
        const blob = await fetch(authUser.photoURL)
        setImage(blob)
    }

    useEffect(() => {
        console.log("Fetching user data (Should only log once)")
        handleFetchUserData().then(() => {
            setLoading(false)
        })
    }, [])

    if (loading || !user) return (
        <Loading/>
    )

    return (
        <View style={[root.statusBar]}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <View style={styles.profilePic}>
                        <Image source={image} style={styles.profilePicImg}/>
                        <View style={styles.edit}>
                            <LinearGradient colors={['#3a6cf0', '#652cd2']}
                                            start={{x: 1, y: 1}}
                                            end={{x: 0, y: 0}}
                                            style={[root.linearBackground, root.roundedHalf]}/>
                            <Image source={edit} style={styles.editIcon}/>
                        </View>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[text.h1, text.pepper]}>{user.displayName}</Text>
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
                        <TouchableOpacity style={styles.socialSection} onPress={() => props.navigation.push("Circles", {circles: user.circles})}>
                            <Image source={circles} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{user.circle_count} Circles</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialSection} onPress={() => props.navigation.push("MembersList", {header: "Friends", friends: user.friends})}>
                            <Image source={followers} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>{user.friend_count} Friends</Text>
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
                        <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={() => resetDisplayName()}>
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
                        <Image source={profilePic} style={styles.profilePicImg}/>
                        <View style={styles.edit}>
                            <LinearGradient colors={['#3a6cf0', '#652cd2']}
                                            start={{x: 1, y: 1}}
                                            end={{x: 0, y: 0}}
                                            style={[root.linearBackground, root.roundedHalf]}/>
                            <Image source={edit} style={styles.editIcon}/>
                        </View>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[text.h1, text.grey]}>{props.route.params.name}</Text>
                        <Text style={[text.p, text.black]}>{props.route.params.username}</Text>
                    </View>

                    <View style={styles.contactInfo}>
                        <View style={styles.infoLine}>
                            <Image source={phone} style={{width: 25, height: 25}}/>
                            <Text style={[text.black, text.p]}>(908) 723-6988</Text>
                        </View>
                        <View style={styles.infoLine}>
                            <Image source={mail} style={{width: 25, height: 25}}/>
                            <Text style={[text.black, text.p]}>jnguyen5@nd.edu</Text>
                        </View>
                        <View style={styles.infoLine}>
                            <Image source={joined} style={{width: 22, height: 25, objectFit: "contain"}}/>
                            <Text style={[text.black, text.p]}>Joined December 2023</Text>
                        </View>
                    </View>

                    <View style={styles.socialInfo}>
                        <TouchableOpacity style={styles.socialSection} onPress={() => props.navigation.push("Circles")}>
                            <Image source={circles} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>7 Circles</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialSection} onPress={() => props.navigation.push("MembersList", {header: "Friends"})}>
                            <Image source={followers} style={styles.socialIcon}/>
                            <Text style={[text.pepper, text.h4]}>185 Friends</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}