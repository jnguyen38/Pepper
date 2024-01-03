import {Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";

import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";
import google from "../../../assets/providers/googleNeutralSI.png";
import text from "../../js/text";
import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import {emailVerification, login} from "../../../server/auth";

export default function LoginScreen(props) {
    const [hidePass, setHidePass] = useState(true)
    const [loading, setLoading] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        setLoading(true);

        try {
            const currUser = await login(email, password);
            console.log(currUser)

            if (currUser) {
                if (!currUser.emailVerified) {
                    setShowEmailVerification(true);
                    await emailVerification();
                }
            }
        } catch (err) {
            setLoading(false);
            if (err.code === "auth/invalid-email") {
                console.warn("Please enter a valid email. Please try again.");
            } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                console.warn("Invalid email or password. Please try again.");
            } else if (err.code === "auth/too-many-requests") {
                console.warn("Too many unsuccessful login attempts. Please try again later.");
            } else {
                console.warn("Unknown sign in error:", err.code, err.message);
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.loginContainer}>
                <LinearGradient colors={['#3a6cf0', '#652cd2']}
                                style={root.linearBackground}/>

                <Footer to={"SignUp"}
                        message={"Don't have an account?"}
                        action={"Sign Up"}
                        {...props}/>

                <Image source={pepperWhite} style={[styles.logo]}/>
                <View style={styles.loginForm}>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Email"}
                               placeholderTextColor={"#ffffff88"}
                               selectionColor={"white"}
                               value={email}
                               onChangeText={text => setEmail(text)}
                               autoComplete={"email"}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Password"}
                               placeholderTextColor={"#ffffff88"}
                               textContentType={"password"}
                               selectionColor={"white"}
                               secureTextEntry={hidePass}
                               value={password}
                               onChangeText={text => setPassword(text)}
                               autoComplete={"password"}/>
                    <Pressable style={[styles.loginButton]} onPress={handleLogin}>
                        <Text style={[text.button, text.white]}>Log In</Text>
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('ForgotPassword')}>
                        <Text style={[text.small, text.white]}>Forgot Password?</Text>
                    </Pressable>
                </View>

                <Or/>

                <View style={styles.providers}>
                    <Image source={google} style={styles.provider}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export function Footer(props) {
    return (
        <View style={[styles.footer, {display: props.display ? props.display : "flex"}]}>
            <Text style={[text.small, text.white]}>
                {props.message}
                <Text onPress={() => props.navigation.navigate(props.to)}
                      style={[text.white, text.smallBold]}> {props.action}</Text>
            </Text>
        </View>
    )
}

export function Or() {
    return (
        <View style={styles.or}>
            <View style={styles.line}/>
            <Text style={[text.fine, text.white]}>OR</Text>
            <View style={styles.line}/>
        </View>
    )
}