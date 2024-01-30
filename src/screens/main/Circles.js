import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import text from "../../js/text";
import styles from "../../styles/modules/main/Circles.module.css";
import root from "../../styles/Root.module.css";
import pepper from "../../../assets/email-sent.png";

import {BackButton, CustomSafeAreaView, FocusAwareStatusBar, Loading, nFormatter} from "../../js/util";
import {useEffect, useState} from "react";
import {getCircle} from "../../../server/user";
import {useQueries} from "@tanstack/react-query";
import {useCircleStore} from "../../js/zustand";

export default function ExploreCircleScreen(props) {
    const circles = useCircleStore(s => s.circles)

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

                    <Content {...props} circles={circles}/>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export function CircleScreen(props) {
    const circles = props.route.params.circles;

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
                    <Content {...props} circles={circles}/>
                </ScrollView>
            </CustomSafeAreaView>
        </View>

    )
}


function Content(props) {
    if (!props.circles) return;

    const [circles, setCircles] = useState(undefined);
    const [loading, setLoading] = useState(true)

    const circleQueries = useQueries({
        queries: props.circles.map((circle) => {
            return {
                queryKey: ['circle', circle],
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

    if (props.circles.length === 0) return (
        <View style={[styles.circles, {justifyContent: "center"}]}>
            <Text style={[text.h2, text.lightgrey]}>No Circles Found</Text>
        </View>
    )

    return (
        <View style={styles.circles}>
            {circles.map((circle, index) => <Circle {...props} circle={circle} key={index}/>)}
        </View>
    )
}

function Circle(props) {
    return (
        <View style={styles.circle}>
            <Image source={{uri: URL.createObjectURL(props.circle.cover)}} style={styles.circleImage}/>

            <LinearGradient colors={['#3971f6aa', '#9028ccaa']}
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 0}}
                            style={[root.linearBackground, root.rounded10]}/>

            <TouchableOpacity style={styles.circleText} activeOpacity={0.8}
                              onPress={() => props.navigation.push("CircleInfo", props.circle)}>
                <Text style={[text.h1, text.white, {textAlign: "center"}]}>{props.circle.title}</Text>
                <Text style={[text.p, text.white]}>{nFormatter(props.circle.member_count, 1)} member{props.circle.member_count === 1 ? "":"s"}</Text>
            </TouchableOpacity>
        </View>
    )
}