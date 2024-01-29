import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "./screens/auth/Login";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ForgotPasswordScreen from "./screens/auth/ForgotPassword";
import SignUpScreen from "./screens/auth/SignUp";
import {StatusBar, View} from "react-native";
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
import {Loading} from "./js/util";
import {getUser, listenUserCircles, listenUserFriends} from "../server/user";
import {useQuery} from "@tanstack/react-query";

const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

export default function Index() {
    const [initializing, setInitializing] = useState(true);
    const [authUser, setAuthUser] = useState(undefined);
    const [emailVerified, setEmailVerified] = useState(false);
    const [displayName, setDisplayName] = useState(undefined);

    function onAuthStateChangedHandler(newUser) {
        setAuthUser(newUser)
        if (newUser) {
            setEmailVerified(newUser.emailVerified);
            setDisplayName(newUser.displayName);
        }

        if (initializing) {
            setInitializing(false);
        }
    }

    function forceUpdateAuthUser() {
        const user = auth.currentUser;

        user.reload().then(() => {
            const refreshUser = auth.currentUser;
            setAuthUser(refreshUser)
            setEmailVerified(refreshUser.emailVerified)
            setDisplayName(refreshUser.displayName);
            console.log("Email verified:", emailVerified)
        })
    }

    function forceDisplayName() {
        setDisplayName(true);
    }

    useEffect(() => {
        return onAuthStateChanged(auth, onAuthStateChangedHandler);
    }, [])

    if (initializing)
        return <Loading/>

    if (!authUser)
        return <Unauthenticated/>

    if (!emailVerified)
        return <VerifyEmail user={authUser} forceReload={forceUpdateAuthUser}/>

    if (!displayName)
        return <InitializeUser user={authUser} forceReload={forceDisplayName}/>

    return <Authenticated authUser={authUser}/>
}

function Unauthenticated() {
    return (
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
}

function Authenticated(props) {
    const [tab, setTab] = useState(0);
    const [location, setLocation] = useState(null);
    const [user, setUser] = useState(undefined);
    const [friends, setFriends] = useState(undefined);
    const [circles, setCircles] = useState(undefined);
    const tabs = ["HomeTab", "SearchTab", "AddTab", "CirclesTab", "ProfileTab"];

    const userQuery = useQuery({
        queryKey: ['init'],
        queryFn: async () => {
            console.log("Init Query Called")
            return await getUser(props.authUser.uid)
        }
    })

    function forceUpdateUser() {
        getUser(props.authUser.uid).then(res => setUser(res))
    }

    async function getLocation() {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.warn("Location permission denied.");
        }

        let loc = await Location.getCurrentPositionAsync();
        setLocation(loc)
    }



    useEffect(() => {
        getLocation().then();

        const unsubscribeFriends = listenUserFriends(setFriends)
        const unsubscribeCircles = listenUserCircles(setCircles)

        return () => {
            unsubscribeFriends()
            unsubscribeCircles()
        }
    }, [])

    if (userQuery.isLoading || userQuery.isFetching || !friends || !circles)
        return <Loading/>

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
                                initialParams={{location: location, user: userQuery.data}}/>
                    <Tab.Screen name={tabs[1]}
                                component={SearchTab} initialParams={{user: userQuery.data}}/>
                    <Tab.Screen name={tabs[2]}>
                        {props => <AddTab user={user} forceUpadateUser={forceUpdateUser}/>}
                    </Tab.Screen>
                    <Tab.Screen name={tabs[3]}
                                component={CirclesTab} initialParams={{user: userQuery.data}}/>
                    <Tab.Screen name={tabs[4]}
                                component={ProfileTab} initialParams={{user: userQuery.data, friends, circles}}/>
                </Tab.Navigator>
            </View>
        </NavigationContainer>
    )
}