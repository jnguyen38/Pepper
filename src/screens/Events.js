import text from "../js/text";
import styles from "../styles/modules/Events.module.css";
import root from "../styles/Root.module.css";
import {ScrollView, Text, View, Image, TouchableOpacity} from "react-native";
import {BackButton, CustomSafeAreaView, FocusAwareStatusBar} from "../js/util";
import bouts from "../../assets/bengalBouts.jpeg";
import biotech from "../../assets/biotech-logo.jpeg";
import sat from "../../assets/irish-sat-logo.jpeg";
import {LinearGradient} from "expo-linear-gradient";
import person from "../../assets/navbar/profile-purple.png"
import clock from "../../assets/clock.png"
import bookmarkOutline from "../../assets/bookmark-outline-purple.png"
import bookmarkFilled from "../../assets/bookmark-filled-purple.png"
import {useState} from "react";

const events = [
    {
        circle: "Bengal Bouts",
        title: "Weekly Meeting",
        time: "now",
        attendees: 250,
        attending: true,
        picture: bouts
    },
    {
        circle: "Irish SAT",
        title: "Flight Planning",
        time: "now",
        attendees: 47,
        attending: true,
        picture: sat
    },
    {
        circle: "Notre Dame Biotech Club",
        title: "Presentations",
        time: "5 PM",
        attendees: 30,
        attending: false,
        picture: biotech
    }
]

export default function EventsList(props) {
    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <BackButton {...props} light={true} transparent={true} safeView={true}/>
                <View style={styles.header}>
                    <Text style={[text.h2, text.pepper]}>Events</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Content {...props}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}

function Content(props) {
    return (
        <View style={styles.events}>
            {events.map((event, index) => {
                const [attending, setAttending] = useState(event.attending);

                function changeAttending() {
                    setAttending(curr => !curr);
                }

                return (
                    <TouchableOpacity style={styles.event} key={index} activeOpacity={0.8}>
                        <View style={styles.imageHolder}>
                            <LinearGradient colors={['#3971f688', '#9028cc88']}
                                            start={{x: 0, y: 0.5}}
                                            end={{x: 1, y: 0.5}}
                                            style={[root.linearBackground, {zIndex: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10}]}/>

                            <Image source={event.picture} style={styles.eventImage}/>
                            <View style={styles.eventText}>
                                <Text style={[text.p, text.white]}>{event.circle}</Text>
                                <Text style={[text.h2, text.white]}>{event.title}</Text>
                            </View>
                        </View>
                        <View style={styles.eventContent}>
                            <View style={styles.contentLine}>
                                <Image source={clock} style={styles.contentLineIcon}/>
                                <Text style={[text.p, text.pepper]}>{event.time}</Text>
                            </View>
                            <View style={styles.contentLine}>
                                <Image source={person} style={styles.contentLineIcon}/>
                                <Text style={[text.p, text.pepper]}>{event.attendees}</Text>
                            </View>

                        </View>

                        <View style={styles.bookmark}>
                            {attending ? (
                                <TouchableOpacity activeOpacity={0.8} style={styles.bookmarkHolder}
                                                  onPress={() => changeAttending()}>
                                    <Image source={bookmarkFilled} style={styles.bookmarkImage}/>
                                </TouchableOpacity>
                            ): (
                                <TouchableOpacity activeOpacity={0.8} style={styles.bookmarkHolder}
                                                  onPress={() => changeAttending()}>
                                    <Image source={bookmarkOutline} style={styles.bookmarkImage}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}