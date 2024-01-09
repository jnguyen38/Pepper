import {
    ActivityIndicator,
    Animated as RNAnimated,
    Easing,
    Image,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useEffect, useState} from "react";

import cross from "../../../assets/x-white.png";
import errorIcon from "../../../assets/error.png";
import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";
import google from "../../../assets/providers/googleNeutralSI.png";
import text from "../../js/text";
import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import {emailVerification, login} from "../../../server/auth";
import {auth} from "../../../server/config/config";
import * as Linking from "expo-linking";

export default function LoginScreen(props) {
    const [hidePass, setHidePass] = useState(true)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(undefined);
    const [disabled, setDisabled] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setDisabled(!email.length || !password.length)
    }, [email, password])

    useEffect(() => {
        setEmailError(false)
    }, [email])

    async function handleLogin() {
        setLoading(true)
        login(email, password).then(async () => {
            const currUser = auth.currentUser;

            if (currUser && !currUser.emailVerified) {
                await emailVerification();
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            setError(undefined)
            if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address");
                setEmailError(true)
            } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password"  || err.code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (err.code === "auth/missing-email" || err.code === "auth/wrong-password"  || err.code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many unsuccessful login attempts. Please try again later.");
            } else {
                setError("Unknown sign in error: Code: " + err.code + " Message: " + err.message);
            }
        })
    }

    function testLink() {
        const link = Linking.createURL("Home")
        console.log(link)
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
                    <TextInput style={[styles.input, text.p, emailError ? styles.errorBorder : null]}
                               keyboardAppearance={'dark'}
                               placeholder={"Username or email"}
                               placeholderTextColor={"#ffffff88"}
                               selectionColor={"white"}
                               value={email}
                               onChangeText={text => setEmail(text)}
                               autoComplete={"username"}/>
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

                    {error ? <Error error={error} setError={setError}/> : null}

                    <TouchableOpacity style={[styles.authButton, disabled ? styles.disabledButton : styles.activeButton]} activeOpacity={0.6} disabled={disabled}
                                      onPress={handleLogin}>
                        {loading ? (
                            <ActivityIndicator size={"small"} color={"white"}/>
                        ) : (
                            <Text style={[text.button, disabled ? text.disabled : text.white]}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPassword')} activeOpacity={0.5}>
                        <Text style={[text.small, text.white]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <Or/>
                <TouchableOpacity onPress={() => testLink()} style={styles.providers}>
                    <View style={styles.providers}>
                        <Image source={google} style={styles.provider}/>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}

export function Error(props) {
    if (!props.error) return;

    const [heightAnim] = useState(new RNAnimated.Value(15));

    useEffect(() => {
        RNAnimated.timing(
            heightAnim,
            {
                toValue: 40,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.elastic(2)
            }
        ).start();
    }, [])

    return (
        <RNAnimated.View style={[styles.errorContainer, {height: heightAnim}]}>
            <View style={[styles.errorContent, {maxWidth: "70%"}]}>
                <Image source={errorIcon} style={styles.errorIcon}/>
                <Text style={[text.fine, text.white]}>{props.error}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.5} style={[styles.errorCrossHolder]}
                              onPress={() => props.setError(undefined)}>
                <Image source={cross} style={styles.errorCross}/>
            </TouchableOpacity>
        </RNAnimated.View>
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