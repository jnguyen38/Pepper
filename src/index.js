import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "./screens/auth/Login";
import {useRecoilState} from "recoil";
import {authState, initializingFirebase, locationState, userState} from "./js/recoil";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ForgotPasswordScreen from "./screens/auth/ForgotPassword";
import SignUpScreen from "./screens/auth/SignUp";
import {StatusBar, View} from "react-native";
import NavBar from "./js/navbar";
import React, {useEffect} from "react";
import * as Location from 'expo-location';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AddTab, CirclesTab, HomeTab, ProfileTab, SearchTab} from "./js/tabs";

// Firebase SDKs and config
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};


const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

export default function Index() {
    const [appAuth] = useRecoilState(authState);
    const [location, setLocation] = useRecoilState(locationState);
    const [initializing, setInitializing] = useRecoilState(initializingFirebase);
    const [user, setUser] = useRecoilState(userState);
    const tabs = ["HomeTab", "SearchTab", "AddTab", "CirclesTab", "ProfileTab"];

    const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);


    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        async function getLocation() {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                console.log("Permission granted.");
            } else {
                console.warn("Permission denied.");
            }

            let loc = await Location.getCurrentPositionAsync();
            console.log(loc)
            setLocation(loc)
        }

        getLocation().then();
    }, [])


    return appAuth ? (
        <NavigationContainer>
            <View style={{height: "100%", width: "100%"}}>
                <Tab.Navigator style={{height: "100%", width: "100%"}}
                               tabBar={props => (<NavBar tabs={tabs} {...props}/>)}
                               screenOptions={{headerShown: false}}>
                    <Tab.Screen name={tabs[0]}
                                component={HomeTab}/>
                    <Tab.Screen name={tabs[1]}
                                component={SearchTab}/>
                    <Tab.Screen name={tabs[2]}
                                component={AddTab}/>
                    <Tab.Screen name={tabs[3]}
                                component={CirclesTab}/>
                    <Tab.Screen name={tabs[4]}
                                component={ProfileTab}/>
                </Tab.Navigator>
            </View>
        </NavigationContainer>
    ) : (
        <NavigationContainer>
            <StatusBar barStyle={"light-content"}/>
            <LoginStack.Navigator screenOptions={{headerShown: false}}>
                <LoginStack.Screen name={"Login"} component={LoginScreen} options={{animation: "none"}}/>
                <LoginStack.Screen name={"ForgotPassword"} component={ForgotPasswordScreen}/>
                <LoginStack.Screen name={"SignUp"} component={SignUpScreen}/>
            </LoginStack.Navigator>
        </NavigationContainer>

    )
}