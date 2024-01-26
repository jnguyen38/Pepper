import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import text from "../../js/text";
import styles from "../../styles/modules/main/Circles.module.css";
import root from "../../styles/Root.module.css";

import {BackButton, CustomSafeAreaView, FocusAwareStatusBar, Loading, nFormatter} from "../../js/util";
import {useEffect, useState} from "react";
import {getCircle} from "../../../server/user";
import {useQueries} from "@tanstack/react-query";

export default function ExploreCircleScreen(props) {
    if (!props.route.params.user) return;

    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <View style={styles.explore}>
                        <LinearGradient colors={['#3971f6', '#9028cc']}
                                        start={{x: 0, y: 1}}
                                        end={{x: 1, y: 0}}
                                        style={[root.linearBackground, root.rounded10]}/>

                        <Text style={[text.h1, text.white]}>Explore circles</Text>
                        <Text style={[text.p, text.white]}>See what your friends are up to</Text>
                    </View>

                    <Content {...props} circles={props.route.params.user.circles}/>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export function CircleScreen(props) {
    if (!props.route.params.circles) return;

    return (
        <View style={root.statusBar}>
            <FocusAwareStatusBar barStyle={"dark-content"} hidden={false} animated={true}/>

            <CustomSafeAreaView>
                <BackButton safeView={true} light={true} transparent={true} {...props}/>
                <View style={styles.header}>
                    <Text style={[text.h2, text.pepper]}>Circles</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollViewContainer}
                            showsVerticalScrollIndicator={false}
                            decelerationRate={"fast"}>
                    <Content {...props} circles={props.route.params.circles}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>

    )
}

function CircleList(props) {


    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={"fast"}>
            <Content {...props} circles={circles}/>
        </ScrollView>
    )
}


function Content(props) {
    if (!props.circles) return;

    const [circles, setCircles] = useState(undefined);
    const [loading, setLoading] = useState(true)

    const circleQueries = useQueries({
        queries: props.circles.map((circle) => {
            return {
                queryKey: ['circles/', circle],
                queryFn: async () => await getCircle(circle),
            }
        }),
    })

    const allFinished = circleQueries.every(query => query.isSuccess)

    useEffect( () => {
        if (allFinished) {
            let data = circleQueries.map(data => data.data)
            setCircles(data)
            setLoading(false)
        }
    }, [allFinished])

    if (loading) return <Loading/>


    return (
        <View style={styles.circles}>
            {circles.map((item, index) => (
                <View style={styles.circle} key={index}>
                    <Image source={{uri: URL.createObjectURL(item.cover)}} style={styles.circleImage}/>

                    <LinearGradient colors={['#3971f6aa', '#9028ccaa']}
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 0}}
                                    style={[root.linearBackground, root.rounded10]}/>

                    <TouchableOpacity style={styles.circleText} activeOpacity={0.8}
                                      onPress={() => props.navigation.push("CircleInfo", item)}>
                        <Text style={[text.h1, text.white, {textAlign: "center"}]}>{item.title}</Text>
                        <Text style={[text.p, text.white]}>{nFormatter(item.member_count, 1)} member{item.member_count === 1 ? "":"s"}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    )
}