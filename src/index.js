import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "./screens/Login";
import {useRecoilState} from "recoil";
import {authState, locationState} from "./js/recoil";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ForgotPasswordScreen from "./screens/ForgotPassword";
import SignUpScreen from "./screens/SignUp";
import {StatusBar, View} from "react-native";
import NavBar from "./js/navbar";
import React, {useEffect} from "react";
import * as Location from 'expo-location';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AddTab, CirclesTab, HomeTab, ProfileTab, SearchTab} from "./js/tabs";

const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()
const {Navigator, Screen} = createNativeStackNavigator();

export default function Index() {
    const [auth] = useRecoilState(authState);
    const [location, setLocation] = useRecoilState(locationState);
    const tabs = ["HomeTab", "SearchTab", "AddTab", "CirclesTab", "ProfileTab"];

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


    return auth ? (
        <NavigationContainer>
            <StatusBar barStyle={"dark-content"} />
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