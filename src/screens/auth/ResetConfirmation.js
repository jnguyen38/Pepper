import {Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import styles from "../../styles/modules/auth/Auth.module.css";
import {LinearGradient} from "expo-linear-gradient";
import root from "../../styles/Root.module.css";
import sent from "../../../assets/email-sent.png";
import text from "../../js/text";

export default function ResetConfirmationScreen(props) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.loginContainer}>
                <LinearGradient colors={['#773af0', '#9b2cd2']}
                                style={root.linearBackground}/>

                <Image source={sent} style={styles.forgotLock}/>
                <View style={styles.textContainer}>
                    <Text style={[text.h2, text.white]}>Reset Complete!</Text>
                    <Text style={[styles.text, text.p, text.white, {width: "70%"}]}>
                        We just sent you a password reset link to
                        <Text style={[text.pBold, text.white]}> {props.route.params.email}</Text>.
                        Have a look and come join us again later.
                    </Text>
                    <Text style={[text.p, text.white]}>See you soon!</Text>
                </View>
                <View style={styles.loginForm}>
                    <TouchableOpacity style={[styles.loginButton, styles.activeButton]} activeOpacity={0.7}
                                      onPress={() => props.navigation.navigate("Login")}>
                        <Text style={[text.button, text.white]}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}