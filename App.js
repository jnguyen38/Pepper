import fonts from "./src/js/fonts";
import {Text} from "react-native";
import {useFonts} from "expo-font";
import {RecoilRoot} from "recoil";
import Index from "./src";
import {Provider} from "react-native-paper"

export default function App() {
    const [fontsLoaded, error] = useFonts(fonts);

    if (!fontsLoaded) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <RecoilRoot>
            <Provider>
                <Index/>
            </Provider>
        </RecoilRoot>
    );
}