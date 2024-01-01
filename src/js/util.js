import {PixelRatio, Platform, StyleSheet, SafeAreaView, StatusBar, View, Image, Pressable} from "react-native";
import styles from "../styles/modules/CircleInfo.module.css";
import backArrow from "../../assets/back-arrow.png";
import backArrowPurple from "../../assets/back-arrow-purple.png";

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
        <Pressable style={[styles.backArrowHolder,
            {
                backgroundColor: props.transparent ? "transparent" : props.light ? "#ffffffcc" : "#6464f6cc",
                top: props.safeView ? 65 : 25
            }]}
                   onPress={() => props.navigation.goBack()}>
            <Image source={props.light ? backArrowPurple : backArrow} style={[styles.backArrow]}/>
        </Pressable>
    )
}