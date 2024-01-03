import {
    Keyboard,
    Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Image,
    KeyboardAvoidingView, TouchableOpacity
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Footer} from "./Login";

import lock from "../../../assets/forgot-password.png";
import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import {useState} from "react";
import {resetPassword} from "../../../server/auth";

export default function ForgotPasswordScreen(props) {
    const [display, setDisplay] = useState("flex");
    const [email, setEmail] = useState("");

    function handleResetPassword() {
        resetPassword(email).then(() => {
            console.log("Reset Password successful");
        }).catch(err => {
            console.warn(err);
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={"height"} style={styles.loginContainer}>
                <LinearGradient colors={['#3a3df0', '#7c2cd2']}
                                style={root.linearBackground}/>

                <Footer to={"Login"}
                        message={""}
                        action={"Back to Login"}
                        display={display}
                        {...props}/>
                <Image source={lock} style={styles.forgotLock}/>
                <View style={styles.textContainer}>
                    <Text style={[text.h2, text.white]}>Forgot your password?</Text>
                    <Text style={[styles.text, text.p, text.white]}>
                        It happens to the best of us! Enter your email below and
                        we'll send you a link to reset your password for your account.
                    </Text>
                </View>
                <View style={styles.loginForm}>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Email"}
                               placeholderTextColor={"#ffffff88"}
                               selectionColor={"white"}
                               onFocus={() => setDisplay("none")}
                               onBlur={() => setDisplay("flex")}
                               value={email}
                               onChangeText={text => setEmail(text)}
                               autoComplete={"email"}/>
                    <TouchableOpacity style={[styles.loginButton]} activeOpacity={0.7}
                                      onPress={handleResetPassword}>
                        <Text style={[text.button, text.white]}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}