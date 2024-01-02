import {
    Button,
    Text,
    View,
    Image,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity
} from "react-native";
import {useRecoilState} from "recoil";
import {authState} from "../js/recoil";
import styles from "../styles/modules/Profile.module.css";
import root from "../styles/Root.module.css";
import text from "../js/text";
import profilePic from "../../assets/brand/pepper-purple-app-icon.png";
import {LinearGradient} from "expo-linear-gradient";
import edit from "../../assets/profile/edit.png";
import phone from "../../assets/profile/phone.png";
import mail from "../../assets/profile/mail.png";
import joined from "../../assets/profile/joined.png";
import circles from "../../assets/profile/circlesPurple.png";
import followers from "../../assets/profile/followersPurple.png";
import logout from "../../assets/profile/logout-slim.png";
import settings from "../../assets/profile/settings.png";
import privacy from "../../assets/profile/privacy.png";
import terms from "../../assets/profile/terms.png";
import {BackButton} from "../js/util";

export default function ProfileScreen(props) {
    const [auth, setAuth] = useRecoilState(authState);

    return (
        <View style={[root.statusBar]}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.profileContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
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
                        <Text style={[text.h1, text.grey]}>Pepper Admin</Text>
                        <Text style={[text.p, text.black]}>@pepperadmin</Text>
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

                    <View style={styles.optionContainer}>
                        <Pressable style={styles.option}>
                            <Image source={terms} style={[{width: 35, height: 25, objectFit: "contain"}]}/>
                            <Text style={[text.h3, text.pepper]}>Terms & Conditions</Text>
                        </Pressable>
                        <Pressable style={styles.option}>
                            <Image source={privacy} style={[{width: 35, height: 25}]}/>
                            <Text style={[text.h3, text.pepper]}>Privacy Policy</Text>
                        </Pressable>
                        <Pressable style={styles.option}>
                            <Image source={settings} style={[{width: 35, height: 25}]}/>
                            <Text style={[text.h3, text.pepper]}>Settings</Text>
                        </Pressable>
                        <Pressable style={[styles.option]} onPress={() => setAuth(false)}>
                            <Image source={logout} style={[{width: 35, height: 25, objectFit: "contain"}]}/>
                            <Text style={[text.h3, text.red]}>Logout</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export function OtherProfileScreen(props) {
    return (
        <View style={[root.statusBar]}>
            <SafeAreaView>
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
            </SafeAreaView>
        </View>
    )
}