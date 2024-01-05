import {Image, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

import email from "../../../assets/email-sent.png";
import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";

export default function VerifyEmail(props) {
    return (
        <View behavior={"height"} style={styles.loginContainer}>
            <LinearGradient colors={['#773af0', '#c12cd2']}
                            style={root.linearBackground}/>

            <Image source={email} style={styles.forgotLock}/>
            <View style={styles.textContainer}>
                <Text style={[text.h2, text.white]}>Congratulations!</Text>
                <Text style={[styles.text, text.p, text.white, {width: "80%"}]} numberOfLines={3} adjustsFontSizeToFit>
                    Just one more step to officially join us at Pepper. We just sent an email to
                    <Text style={[text.pBold, text.white]}> {props.user.email}</Text>.
                </Text>
                <Text style={[styles.text, text.p, text.white, {width: "65%"}]}>
                    Please verify your email address to continue to the app!
                </Text>
                <TouchableOpacity style={[styles.loginButton, styles.activeButton]} activeOpacity={0.7}
                                  onPress={() => props.forceReload()}>
                    <Text style={[text.button, text.white]}>Reload</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}