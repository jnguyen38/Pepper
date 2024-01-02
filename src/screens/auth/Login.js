import {Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import {useRecoilState} from "recoil";
import {authState, tabState} from "../../js/recoil";

import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";
import google from "../../../assets/providers/googleNeutralSI.png";
import text from "../../js/text";
import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";

export default function LoginScreen(props) {
    const [hidePass, setHidePass] = useState(true)
    const [auth, setAuth] = useRecoilState(authState);
    const [tab, setTab] = useRecoilState(tabState);

    function authenticate() {
        setAuth(true);
        setTab(0);
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
                               placeholder={"Username"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               autoComplete={"email"}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Password"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               textContentType={"password"}
                               secureTextEntry={hidePass}
                               autoComplete={"password"}/>
                    <Pressable style={[styles.loginButton]} onPress={authenticate}>
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
        <View style={styles.footer}>
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