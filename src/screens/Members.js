import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import text from "../js/text";
import styles from "../styles/modules/Members.module.css";
import root from "../styles/Root.module.css";
import {BackButton, CustomSafeAreaView, FocusAwareStatusBar, Loading} from "../js/util";
import {useEffect, useState} from "react";
import {useQueries, useQueryClient} from "@tanstack/react-query";
import {friend, getMember, unfriend} from "../../server/user";
import {auth} from "../../server/config/config";

export default function MembersScreen(props) {
    if (!props.route.params.friends) return <Loading/>

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
                    <Content {...props} members={props.route.params.friends}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>
    )
}

function Content(props) {
    if (!props.members) return;

    const [members, setMembers] = useState(undefined);
    const [loading, setLoading] = useState(true)

    const usersQueries = useQueries({
        queries: props.members.map((user) => {
            return {
                queryKey: ['user', user],
                queryFn: async () => await getMember(user),
            }
        }),
    })

    const allFinished = usersQueries.every(query => query.isSuccess && query.fetchStatus === "idle")

    useEffect( () => {
        if (allFinished) {
            let data = usersQueries.map(data => data.data)
            setMembers(data)
            setLoading(false)
        }
    }, [allFinished])

    if (loading) return <Loading/>

    if (props.members.length === 0) return (
        <View style={[styles.members, {justifyContent: "center"}]}>
            <Text style={[text.h2, text.lightgrey]}>No Friends Found</Text>
        </View>
    )

    return (
        <View style={styles.members}>
            {members.map((member, index) => <Member {...props} key={index} member={member}/>)}
        </View>
    )
}

function Member(props) {
    const [isFriend, setIsFriend] = useState(props.route.params.user.friends.includes(props.member.uid))
    const queryClient = useQueryClient()

    async function handleToggleFriend() {
        const tempIsFriend = isFriend
        setIsFriend(curr => !curr)

        if (tempIsFriend) {
            await unfriend(props.route.params.user.uid, props.member.uid)
        } else {
            await friend(props.route.params.user.uid, props.member.uid)
        }

        await queryClient.invalidateQueries({queryKey: ["profile", props.route.params.user.uid]})
        await queryClient.invalidateQueries({queryKey: ["user", props.route.params.user.uid]})
        await queryClient.invalidateQueries({queryKey: ["user", props.member.uid]})
    }

    return (
        <View style={styles.member}>
            <TouchableOpacity style={styles.toProfile}
                              activeOpacity={0.8}
                              onPress={() => props.navigation.push("OtherProfile", props.member)}>
                <Image source={{uri: URL.createObjectURL(props.member.photo)}} style={styles.profilePic}/>
                <View style={styles.textHolder}>
                    <Text style={[text.h4, text.pepper]}>{props.member.displayName}</Text>
                    <Text style={[text.p, text.grey]}>@{props.member.username}</Text>
                </View>
            </TouchableOpacity>
            {props.member.uid === auth.currentUser.uid ? null : (
                <TouchableOpacity style={isFriend ? styles.friend : styles.follow} activeOpacity={0.6}
                                  onPress={() => handleToggleFriend()}>
                    <Text style={[text.p, isFriend ? text.white : text.pepper]}>{isFriend ? "Friends" : "Follow"}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}