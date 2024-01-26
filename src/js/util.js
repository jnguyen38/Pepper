import {ActivityIndicator, Image, PixelRatio, SafeAreaView, StatusBar, TouchableOpacity, View} from "react-native";
import styles from "../styles/modules/CircleInfo.module.css";
import backArrow from "../../assets/back-arrow.png";
import backArrowPurple from "../../assets/back-arrow-purple.png";
import {useIsFocused} from "@react-navigation/native";
import React from "react";

export function getFont(size) {
    const fontScale = PixelRatio.getFontScale()
    return size/fontScale;
}

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

export function Loading() {
    return (
        <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size={"large"} color={"#6464f6"}/>
        </View>
    )
}

export async function parseDownloadURL(downloadURL) {
    console.log("GET DownloadURL")
    return await (await fetch(downloadURL)).blob()
}