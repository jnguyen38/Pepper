import {Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Footer} from "./Login";

import lock from "../../assets/forgot-password.png";
import styles from "../styles/modules/Auth.module.css";
import root from "../styles/Root.module.css";
import text from "../js/text";

export default function ForgotPasswordScreen(props) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.loginContainer}>
                <LinearGradient colors={['#3a3df0', '#7c2cd2']}
                                style={root.linearBackground}/>

                <Footer to={"Login"}
                        message={""}
                        action={"Back to Login"}
                        {...props}/>
                <Image source={lock} style={styles.forgotLock}/>
                <Text style={[text.h2, text.white]}>Forgot your password?</Text>
                <Text style={[styles.text, text.p, text.white]}>
                    It happens to the best of us! Enter your email below and
                    we'll send you a link to reset your password for your account.
                </Text>
                <View style={styles.loginForm}>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Email"}
                               placeholderTextColor={"white"}
                               selectionColor={"white"}
                               autoComplete={"email"}/>
                    <Pressable style={[styles.loginButton]}>
                        <Text style={[text.button, text.white]}>Reset Password</Text>
                    </Pressable>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}