import {Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import {Footer, Or} from "./Login";

import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import google from "../../../assets/providers/googleNeutralSU.png";
import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";

export default function SignUpScreen(props) {
    const [hidePass, setHidePass] = useState(true)

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.loginContainer}>
                <LinearGradient colors={['#3a95f0', '#322cd2']}
                                style={root.linearBackground}/>

                <Footer to={"Login"}
                        message={""}
                        action={"Back to Login"}
                        {...props}/>

                <Image source={pepperWhite} style={[styles.logo]}/>
                <View style={styles.loginForm}>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Username"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               autoComplete={"username-new"}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Email"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               autoComplete={"email"}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Password"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               textContentType={"newPassword"}
                               secureTextEntry={hidePass}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Confirm password"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               textContentType={"newPassword"}
                               secureTextEntry={hidePass}/>
                    <Pressable style={[styles.loginButton]}>
                        <Text style={[text.button, text.white]}>Sign Up</Text>
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