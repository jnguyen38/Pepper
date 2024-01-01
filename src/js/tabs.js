import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AddScreen from "../screens/Add";
import SearchScreen from "../screens/Search";
import ExploreCircleScreen, {CircleScreen} from "../screens/Circles";
import ProfileScreen, {OtherProfileScreen} from "../screens/Profile";
import HomeScreen from "../screens/Home";
import CircleInfoScreen from "../screens/CircleInfo";
import MembersScreen from "../screens/Members";

export function HomeTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}>
            <Screen name={"Home"} component={HomeScreen}/>
        </Navigator>
    )
}

export function SearchTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}>
            <Screen name={"Home"} component={SearchScreen}/>
        </Navigator>
    )
}

export function AddTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}>
            <Screen name={"Home"} component={AddScreen}/>
        </Navigator>
    )
}

export function CirclesTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={ExploreCircleScreen}/>
            <Screen name={"Circles"} component={CircleScreen}/>
            <Screen name={"CircleInfo"} component={CircleInfoScreen}/>
            <Screen name={"MembersList"} component={MembersScreen}/>
            <Screen name={"OtherProfile"} component={OtherProfileScreen}/>
        </Navigator>
    )
}

export function ProfileTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={ProfileScreen}/>
            <Screen name={"Circles"} component={CircleScreen}/>
            <Screen name={"CircleInfo"} component={CircleInfoScreen}/>
            <Screen name={"MembersList"} component={MembersScreen}/>
            <Screen name={"OtherProfile"} component={OtherProfileScreen}/>
        </Navigator>
    )
}