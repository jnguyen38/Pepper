import {View} from "react-native";
import {useEffect} from "react";

export default function Post(props) {
    useEffect(() => {
        console.log("Props:", props)
    }, [])

    return (
        <View>
        </View>
    )
}