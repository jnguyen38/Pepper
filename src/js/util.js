import {Image, SafeAreaView, StatusBar, TouchableOpacity, View, Text} from "react-native";
import styles from "../styles/modules/CircleInfo.module.css";
import backArrow from "../../assets/back-arrow.png";
import backArrowPurple from "../../assets/back-arrow-purple.png";
import {useIsFocused} from "@react-navigation/native";
import React from "react";
import {MaterialIndicator} from "react-native-indicators";
import text from "../js/text";

export const PROFILE_QUALITY = 0.1;

export function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" }
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });

    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function BackButton(props) {
    return (
        <TouchableOpacity style={[styles.backArrowHolder,
            {
                backgroundColor: props.transparent ? "transparent" : props.light ? "#ffffffcc" : "#6464f6cc",
                top: props.safeView ? 5 : 25
            }]}
                   onPress={() => props.navigation.goBack()} activeOpacity={0.5}>
            <Image source={props.light ? backArrowPurple : backArrow} style={[styles.backArrow]}/>
        </TouchableOpacity>
    )
}

export function CustomSafeAreaView({children}) {
    return (
        <SafeAreaView>
            <View style={{width: "100%", height: "100%", position: "relative"}}>
                {children}
            </View>
        </SafeAreaView>
    )
}

export function Line(props) {
    return (
        <View style={{width: "100%", height: 1, backgroundColor: props.color}}/>
    )

}

export function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
}

export function Loading(props) {
    let size;
    if (props.size === "large") {
        size = 45
    } else if (props.size === "medium") {
        size = 30
    } else if (props.size === "small") {
        size = 20
    } else if (props.size === "xsmall") {
        size = 12
    } else {
        size = props.size ? props.size : 30;
    }

    return (
        <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <View style={{position: "relative", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <View style={{position: "absolute"}}>
                    <MaterialIndicator size={size + 10} trackWidth={2} color={"#6464f6"}/>
                </View>
                <View style={{position: "absolute"}}>
                    <MaterialIndicator size={size} trackWidth={1} color={"#6464f6"}/>
                </View>
            </View>
        </View>
    )
}

export async function parseDownloadURL(downloadURL) {
    console.log("GET DownloadURL")
    return await (await fetch(downloadURL)).blob()
}

export function ParagraphText (props) {
    return (
        <Text style={[text.p, text.black, {...props.styles}]}>{props.children}</Text>
    )
}
