import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AddScreen from "../screens/main/Add";
import SearchScreen from "../screens/main/Search";
import ExploreCircleScreen, {CircleScreen} from "../screens/main/Circles";
import ProfileScreen, {OtherProfileScreen} from "../screens/main/Profile";
import HomeScreen from "../screens/main/Home";
import CircleInfoScreen from "../screens/CircleInfo";
import MembersScreen from "../screens/Members";
import EventsList from "../screens/Events";
import NewCircle from "../screens/NewCircle";
import ProfilePreview from "../screens/ProfilePreview";
import {useEffect} from "react";

export function HomeTab({route}) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={HomeScreen}
                    initialParams={{location: route.params.location}}/>
            <Screen name={"EventsList"} component={EventsList}/>
        </Navigator>
    )
}

export function SearchTab() {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={SearchScreen}/>
        </Navigator>
    )
}

export function AddTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"}>
                {nav => <AddScreen {...nav} user={props.user} forceUpadateUser={props.forceUpdateUser}/>}
            </Screen>
            <Screen name={"NewCircle"} component={NewCircle}/>
        </Navigator>
    )
}

export function CirclesTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();
    const user = props.route.params.user;

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={ExploreCircleScreen} initialParams={{user}}/>
            <Screen name={"Circles"} component={CircleScreen}/>
            <Screen name={"CircleInfo"} component={CircleInfoScreen}/>
            <Screen name={"MembersList"} component={MembersScreen} initialParams={{user}}/>
            <Screen name={"OtherProfile"} component={OtherProfileScreen} initialParams={{user}}/>
            <Screen name={"EventsList"} component={EventsList}/>
            <Screen name={"ProfilePreview"} component={ProfilePreview} options={{animation: "fade", animationDuration: 500}}/>
        </Navigator>
    )
}

export function ProfileTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();
    const user = props.route.params.user;

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={ProfileScreen} initialParams={{user}}/>
            <Screen name={"Circles"} component={CircleScreen}/>
            <Screen name={"CircleInfo"} component={CircleInfoScreen}/>
            <Screen name={"MembersList"} component={MembersScreen} initialParams={{user}}/>
            <Screen name={"OtherProfile"} component={OtherProfileScreen} initialParams={{user}}/>
            <Screen name={"EventsList"} component={EventsList}/>
            <Screen name={"ProfilePreview"} component={ProfilePreview} options={{animation: "fade", animationDuration: 500}}/>
        </Navigator>
    )
}