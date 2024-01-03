import {Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Footer, Or} from "./Login";

import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import google from "../../../assets/providers/googleNeutralSU.png";
import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";
import {useState} from "react";
import {register} from "../../../server/auth";

export default function SignUpScreen(props) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    function handleSignUp() {
        register(email, password).then(registeredUser => {
        }).catch(err => {
            console.warn(err);
        })
    }

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
                               placeholderTextColor={"#ffffff88"}
                               selectionColor={"white"}
                               value={username}
                               onChangeText={text => setUsername(text)}
                               autoComplete={"username-new"}/>
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
                               selectionColor={"white"}
                               textContentType={"newPassword"}
                               value={password}
                               onChangeText={text => setPassword(text)}
                               secureTextEntry={true}/>
                    <TextInput style={[styles.input, text.p]}
                               keyboardAppearance={'dark'}
                               placeholder={"Confirm password"}
                               placeholderTextColor={"#ffffff88"}
                               selectionColor={"white"}
                               textContentType={"newPassword"}
                               value={confirm}
                               onChangeText={text => setConfirm(text)}
                               secureTextEntry={true}/>
                    <TouchableOpacity style={[styles.loginButton]} activeOpacity={0.5}
                                      onPress={handleSignUp}>
                        <Text style={[text.button, text.white]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <Or/>

                <View style={styles.providers}>
                    <Image source={google} style={styles.provider}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}