import {
    ActivityIndicator,
    Image,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Footer, Or, Error} from "./Login";
import {debounce} from "lodash";

import styles from "../../styles/modules/auth/Auth.module.css";
import root from "../../styles/Root.module.css";
import text from "../../js/text";
import google from "../../../assets/providers/googleNeutralSU.png";
import pepperWhite from "../../../assets/brand/Pepper-Big-Logo-White.png";
import {useCallback, useEffect, useState} from "react";
import {emailVerification, register} from "../../../server/auth";
import {auth} from "../../../server/config/config";

export default function SignUpScreen(props) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [passMatch, setPassMatch] = useState(true);
    const [passLength, setPassLength] = useState(false);
    const [usernameTooLong, setUsernameTooLong] = useState(false);
    const [invalidChars, setInvalidChars] = useState(false);
    const [error, setError] = useState(undefined);
    const [userError, setUserError] = useState(undefined);
    const [emailError, setEmailError] = useState(undefined);
    const [passError, setPassError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    function checkPassword(pm, p, c) {
        let err = "";
        if (p && p.length < 6) {
            err += (err ? "\n" : "") + "Password must be at least 6 characters"
        }
        if (!pm && p && c) {
            err += (err ? "\n" : "") + "Passwords must match"
        }
        setPassError(err)
    }

    function checkUsername(user) {
        let tempUserError = undefined;
        let tempInvalidChars = false;
        let tempUsernameTooLong = false;

        if (!(/^[A-Za-z][A-Za-z0-9_]+$/.test(user))) {
            tempUserError = "Username can only include letters, numbers, and underscores"
            tempInvalidChars = true;
        }

        if (user.length > 30) {
            tempUserError = "Username must be less than 30 characters"
            tempUsernameTooLong = true;
        }

        setUserError(tempUserError)
        setInvalidChars(tempInvalidChars)
        setUsernameTooLong(tempUsernameTooLong)
    }

    const debouncedCheckPassword = useCallback(debounce(checkPassword, 500), []);
    const debouncedCheckUsername = useCallback(debounce(checkUsername, 500), []);

    async function handleSignUp() {
        setLoading(true);
        register(username, email, password).then(async user => {
            if (user && !user.emailVerified) {
                await emailVerification();
            }
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            if (err.code === "auth/weak-password") {
                setPassError(undefined)
                setPassError("Password should be at least 6 characters")
            } else if (err.code === "auth/invalid-email") {
                setEmailError(undefined)
                setEmailError("Please enter a valid email address");
            } else if (err.code === "auth/username-already-exists") {
                setUserError(undefined)
                setUserError(err.message);
            } else if (err.code === "auth/email-already-in-use") {
                setEmailError(undefined)
                setEmailError(<Text>
                    Email is already in use.
                        <Text onPress={() => props.navigation.navigate("Login")} style={[text.fineBold, text.white]}> Sign in here</Text>
                </Text>);
            } else {
                setError(undefined)
                setError("Unknown sign in error: Code: " + err.code + " Message: " + err.message);
            }
        })
    }

    useEffect(() => {
        setDisabled(!email || !password || !confirm || !username || !passMatch || !passLength || usernameTooLong || invalidChars);
    }, [email, password, confirm, username, passMatch])

    useEffect(() => {
        setPassLength(!(password && password.length < 6))
        setPassMatch(password === confirm)
    }, [password, confirm])

    useEffect(() => {
        debouncedCheckPassword(passMatch, password, confirm)
    }, [passMatch, password, confirm])

    useEffect(() => {
        if (username) {
            debouncedCheckUsername(username);
        } else {
            setUserError(undefined)
        }
    }, [username])

    useEffect(() => {
        setEmailError(undefined)
    }, [email])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.loginContainer}>
                <LinearGradient colors={['#3a95f0', '#322cd2']}
                                style={root.linearBackground}/>

                <Footer to={"Login"}
                        message={""}
                        action={"Back to Login"}
                        {...props}/>
                <View style={styles.signUp}>
                    <Image source={pepperWhite} style={[styles.logo]}/>
                    <View style={[styles.loginForm]}>
                        <TextInput style={[styles.input, text.p, userError ? styles.errorBorder : null]}
                                   keyboardAppearance={'dark'}
                                   placeholder={"Username"}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   value={username}
                                   onChangeText={text => setUsername(text)}
                                   autoComplete={"username-new"}/>
                        {userError ? <Error error={userError} setError={setUserError}/> : null}
                        <TextInput style={[styles.input, text.p, emailError ? styles.errorBorder : null]}
                                   keyboardAppearance={'dark'}
                                   placeholder={"Email"}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   value={email}
                                   onChangeText={text => setEmail(text)}
                                   autoComplete={"email"}/>
                        {emailError ? <Error error={emailError} setError={setEmailError}/> : null}
                        <TextInput style={[styles.input, text.p, passError ? styles.errorBorder : null]}
                                   keyboardAppearance={'dark'}
                                   placeholder={"Password"}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   textContentType={"newPassword"}
                                   value={password}
                                   onChangeText={text => setPassword(text)}
                                   onChange={() => debouncedCheckPassword()}
                                   secureTextEntry={true}/>
                        <TextInput style={[styles.input, text.p, passError ? styles.errorBorder : null]}
                                   keyboardAppearance={'dark'}
                                   placeholder={"Confirm password"}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   textContentType={"newPassword"}
                                   value={confirm}
                                   onChangeText={text => setConfirm(text)}
                                   onChange={() => debouncedCheckPassword()}
                                   secureTextEntry={true}/>
                        {passError ? <Error error={passError} setError={setPassError}/> : null}
                        {error ? <Error error={error} setError={setError}/> : null}
                        <TouchableOpacity style={[styles.authButton, disabled ? styles.disabledButton : styles.activeButton]}
                                          activeOpacity={0.5} disabled={disabled}
                                          onPress={handleSignUp}>
                            {loading ? (
                                <ActivityIndicator size={"small"} color={"white"}/>
                            ) : (
                                <Text style={[text.button, disabled ? text.disabled : text.white]}>Sign Up</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Or/>

                    <View style={styles.providers}>
                        <Image source={google} style={styles.provider}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}