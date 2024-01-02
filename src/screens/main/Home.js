import root from "../../styles/Root.module.css";
import styles from "../../styles/modules/main/Home.module.css"
import text from "../../js/text";
import {StatusBar, Text, TouchableOpacity, View} from "react-native";
import {useRecoilState} from "recoil";
import {locationState} from "../../js/recoil";
import {LinearGradient} from "expo-linear-gradient";
import MapView from "react-native-maps";
import {CustomSafeAreaView, FocusAwareStatusBar} from "../../js/util";

export default function HomeScreen(props) {

    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <View style={styles.homeContainer}>
                    <TouchableOpacity style={styles.upcoming} activeOpacity={0.8}
                                      onPress={() => props.navigation.push("EventsList")}>
                        <LinearGradient colors={['#3971f6', '#9028cc']}
                                        start={{x: 1, y: 1}}
                                        end={{x: 0, y: 0}}
                                        style={[root.linearBackground, root.rounded10]}/>

                        <Text style={[text.h1, text.white]}>Your events</Text>
                        <Text style={[text.p, text.white]}>See what's coming up next</Text>
                    </TouchableOpacity>
                    <Map/>
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

function Map() {
    const [location] = useRecoilState(locationState);
    const NDLoc = {
        latitude: 41.7002,
        longitude: -86.2379,
        latitudeDelta: 0.03,
        longitudeDelta: 0.015
    }
    const myLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04
    }

    return Object.keys(location).length ? (
        <MapView style={styles.map}
                 showsUserLocation={true}
                 showsCompass={true}
                 showsMyLocationButton={true}
                 initialRegion={myLoc}>
        </MapView>
    ) : (
        <MapView style={styles.map}>
            <View style={[styles.mapOverlay]}>
                <Text style={[text.p, text.grey]}>Please allow location services in settings to enable the map</Text>
            </View>
        </MapView>
    )

}
