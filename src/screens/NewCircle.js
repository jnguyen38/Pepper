import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "../styles/modules/auth/Auth.module.css";
import {LinearGradient} from "expo-linear-gradient";
import root from "../styles/Root.module.css";
import sent from "../../assets/email-sent.png";
import text from "../js/text";

export default function NewCircle(props) {
    return (
        <View style={styles.loginContainer}>
            <LinearGradient colors={['#773af0', '#9b2cd2']}
                            style={root.linearBackground}/>

            <Image source={sent} style={styles.forgotLock}/>
            <View style={styles.textContainer}>
                <Text style={[text.h2, text.white]}>Congrats!</Text>
                <Text style={[styles.text, text.p, text.white, {width: "70%"}]}>
                    You've successfully registered
                    <Text style={[text.pBold, text.white]}> {props.route.params.circle}</Text>.
                </Text>
                <Text style={[text.p, text.white]}>Send an invite to your friends!</Text>
            </View>
            <View style={styles.loginForm}>
                <TouchableOpacity style={[styles.authButton, styles.activeButton]} activeOpacity={0.7}
                                  onPress={() => props.navigation.goBack()}>
                    <Text style={[text.button, text.white]}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}