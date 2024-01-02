import {Image, Pressable, ScrollView, StatusBar, Text, View} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/Members.module.css";
import root from "../styles/Root.module.css";
import mockPicture from "../../assets/brand/pepper-purple-app-icon.png";
import {BackButton, CustomSafeAreaView, FocusAwareStatusBar} from "../js/util";
import {useEffect} from "react";

const members = [
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: true
    },
    {
        name: "Cat Pardi",
        username: "@cpardi1",
        friend: true
    },
    {
        name: "Peter Ainsworth",
        username: "@painsworth6969",
        friend: true
    },
    {
        name: "Dennis Hutchison",
        username: "@dhutch28",
        friend: true
    },
    {
        name: "Lucas Kopp",
        username: "@lkopp383",
        friend: true
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: true
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: true
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: true
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: true
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    },
    {
        name: "Jonathan Nguyen",
        username: "@jnguyen38",
        friend: false
    }
]

export default function MembersScreen(props) {
    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <BackButton transparent={true} light={true} safeView={true} {...props}/>

                <View style={styles.header}>
                    <Text style={[text.h2, text.pepper]}>{props.route.params?.header}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <Content {...props}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}

function Content(props) {
    return (
        <View style={styles.members}>
            {members.map((member, index) =>
                <View style={styles.member} key={index}>
                    <Pressable style={styles.toProfile}
                               onPress={() => props.navigation.push("OtherProfile", member)}>
                        <Image source={mockPicture} style={styles.profilePic}/>
                        <View style={styles.textHolder}>
                            <Text style={[text.h4, text.pepper]}>{member.name}</Text>
                            <Text style={[text.p, text.grey]}>{member.username}</Text>
                        </View>
                    </Pressable>
                    {
                        member.friend ? (
                            <View style={styles.friend}>
                                <Text style={[text.p, text.white]}>Friends</Text>
                            </View>
                        ) : (
                            <View style={styles.follow}>
                                <Text style={[text.p, text.pepper]}>Follow</Text>
                            </View>
                        )
                    }


                </View>
            )}
        </View>
    )
}