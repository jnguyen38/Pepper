import {
    ActivityIndicator,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image, KeyboardAvoidingView, StatusBar
} from "react-native";
import styles from "../styles/modules/auth/Auth.module.css";
import {LinearGradient} from "expo-linear-gradient";
import root from "../styles/Root.module.css";
import text from "../js/text";
import {Error} from "./auth/Login";
import {useEffect, useState} from "react";
import MaskInput, {Masks} from "react-native-mask-input";
import {initializeUserInfo} from "../../server/user";
import * as ImagePicker from "expo-image-picker";
import add from "../../assets/add-white.png"

export default function InitializeUser(props) {
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [unmaskedNumber, setUnmaskedNumber] = useState("")
    const [image, setImage] = useState(null)
    const [error, setError] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true);

    async function pickImage() {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.3,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
            console.log(typeof (result.assets[0]))
        }
    }

    function handleUpdate() {
        setLoading(true)
        initializeUserInfo(name, number, image).then(() => {
            setLoading(false)
            props.forceReload()
        }).catch(err => {
            setLoading(false)
            console.warn("Error", err)
        })
    }

    useEffect(() => {
        setDisabled(!name)
    }, [name])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={"height"} style={styles.loginContainer}>
                <StatusBar barStyle={"light-content"}/>
                <LinearGradient colors={['#5b3af0', '#9b2cd2']}
                                style={root.linearBackground}/>

                <View style={{width: '100%', display: "flex", alignItems: "center"}}>
                    <Text style={[styles.text, text.h1, text.white]}>Let's Setup Your Account</Text>
                </View>
                {!image ? (
                    <View style={{width: '100%', display: "flex", alignItems: "center"}}>
                        <Text style={[text.white, text.smallBold]}>Add a Profile Pic <Text style={[text.white, text.small]}>(Optional)</Text></Text>
                    </View>
                ) : null}

                <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.pickedImage} />
                    ) : (
                        <View style={styles.defaultImage}>
                            <Image source={add} style={{height: "30%", aspectRatio: "1/1"}}/>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.loginForm}>
                    <View style={styles.initializeInputHolder}>
                        <Text style={[text.fine, text.white]}><Text style={[text.fineBold, text.white]}>Display Name</Text> (Required)</Text>
                        <TextInput style={[styles.input, text.p, {width: "100%"}]}
                                   keyboardAppearance={'dark'}
                                   placeholder={"Display name"}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   value={name}
                                   onChangeText={text => setName(text)}/>
                        <Text style={[text.fine, text.white]}>Your Display Name is what you think other people in the app should call you</Text>
                    </View>
                    <View style={styles.initializeInputHolder}>
                        <Text style={[text.fine, text.white]}><Text style={[text.fineBold, text.white]}>Phone Number</Text> (Optional)</Text>
                        <MaskInput style={[styles.input, text.p, {width: "100%"}]}
                                   keyboardAppearance={'dark'}
                                   keyboardType={"numeric"}
                                   placeholder={"Phone number"}
                                   placeholderTextColor={"#ffffff88"}
                                   textContentType={"telephoneNumber"}
                                   selectionColor={"white"}
                                   mask={Masks.USA_PHONE}
                                   value={number}
                                   onChangeText={(masked, unmasked) => {
                                       setNumber(masked);
                                       setUnmaskedNumber(unmasked)
                                   }}/>
                        <Text style={[text.fine, text.white]}>Just in case you want to provide it for other people! We won't use it!</Text>
                    </View>

                    {error ? <Error error={error} setError={setError}/> : null}

                    <TouchableOpacity style={[styles.authButton, disabled ? styles.disabledButton : styles.activeButton]}
                                      activeOpacity={0.6} disabled={disabled}
                                      onPress={handleUpdate}>
                        {loading ? (
                            <ActivityIndicator size={"small"} color={"white"}/>
                        ) : (
                            <Text style={[text.button, disabled ? text.disabled : text.white]}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}