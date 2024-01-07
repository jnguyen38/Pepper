import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AddScreen from "../screens/main/Add";
import SearchScreen from "../screens/main/Search";
import ExploreCircleScreen, {CircleScreen} from "../screens/main/Circles";
import ProfileScreen, {OtherProfileScreen} from "../screens/main/Profile";
import HomeScreen from "../screens/main/Home";
import CircleInfoScreen from "../screens/CircleInfo";
import MembersScreen from "../screens/Members";
import EventsList from "../screens/Events";

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

export function SearchTab(props) {
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
            <Screen name={"EventsList"} component={EventsList}/>
        </Navigator>
    )
}

export function ProfileTab(props) {
    const {Navigator, Screen} = createNativeStackNavigator();
    const user = props.route.params.user

    return (
        <Navigator style={{width: "100%", height: "100%"}}
                   screenOptions={{headerShown: false}}>
            <Screen name={"Home"} component={ProfileScreen}
                    initialParams={{user: user}}/>
            <Screen name={"Circles"} component={CircleScreen}
                    initialParams={{user: user}}/>
            <Screen name={"CircleInfo"} component={CircleInfoScreen}
                    initialParams={{user: user}}/>
            <Screen name={"MembersList"} component={MembersScreen}
                    initialParams={{user: user}}/>
            <Screen name={"OtherProfile"} component={OtherProfileScreen}
                    initialParams={{user: user}}/>
        </Navigator>
    )
}