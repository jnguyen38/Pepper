import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "./screens/auth/Login";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ForgotPasswordScreen from "./screens/auth/ForgotPassword";
import SignUpScreen from "./screens/auth/SignUp";
import {ActivityIndicator, StatusBar, View} from "react-native";
import NavBar from "./js/navbar";
import React, {useEffect, useState} from "react";
import * as Location from 'expo-location';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AddTab, CirclesTab, HomeTab, ProfileTab, SearchTab} from "./js/tabs";
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from "../server/config/config";
import ResetConfirmationScreen from "./screens/auth/ResetConfirmation";
import VerifyEmail from "./screens/auth/VerifyEmail";
import InitializeUser from "./screens/InitializeUser";

const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

export default function Index() {
    const [location, setLocation] = useState(null);
    const [tab, setTab] = useState(0);
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(undefined);
    const [emailVerified, setEmailVerified] = useState(false);
    const [displayName, setDisplayName] = useState(undefined);
    const tabs = ["HomeTab", "SearchTab", "AddTab", "CirclesTab", "ProfileTab"];

    function onAuthStateChangedHandler(newUser) {
        setUser(newUser)
        if (newUser) {
            setEmailVerified(newUser.emailVerified);
            setDisplayName(newUser.displayName);
        }

        if (initializing) {
            setInitializing(false);
        }
    }

    function forceReloadUser() {
        const user = auth.currentUser;

        user.reload().then(() => {
            const refreshUser = auth.currentUser;
            setUser(refreshUser)
            setEmailVerified(refreshUser.emailVerified)
            setDisplayName(refreshUser.displayName);
            console.log("Email verified:", emailVerified)
        })
    }

    function forceDisplayName() {
        setDisplayName(true);
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
            setLocation(loc)
        }

        getLocation().then();

        return onAuthStateChanged(auth, onAuthStateChangedHandler);
    }, [])

    if (initializing) return (
        <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size={"large"} color={"#6464f6"}/>
        </View>
    )

    if (!user) return (
        <NavigationContainer>
            <StatusBar barStyle={"light-content"}/>
            <LoginStack.Navigator screenOptions={{headerShown: false}}>
                <LoginStack.Screen name={"Login"} component={LoginScreen} options={{animation: "none"}}/>
                <LoginStack.Screen name={"ForgotPassword"} component={ForgotPasswordScreen}/>
                <LoginStack.Screen name={"SignUp"} component={SignUpScreen}/>
                <LoginStack.Screen name={"ResetConfirmation"} component={ResetConfirmationScreen}/>
            </LoginStack.Navigator>
        </NavigationContainer>
    )

    if (!emailVerified) return (
        <VerifyEmail user={user} forceReload={forceReloadUser}/>
    )

    if (!displayName) return (
        <InitializeUser user={user} forceReload={forceDisplayName}/>
    )

    return (
        <NavigationContainer>
            <View style={{height: "100%", width: "100%"}}>
                <Tab.Navigator style={{height: "100%", width: "100%"}}
                               tabBar={props => (
                                   <NavBar tab={tab} setTab={setTab} tabs={tabs} {...props}/>
                               )}
                               screenOptions={{headerShown: false}}>
                    <Tab.Screen name={tabs[0]}
                                component={HomeTab}
                                initialParams={{location: location}}/>
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
    )
}