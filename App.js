import fonts from "./src/js/fonts";
import {Text} from "react-native";
import {useFonts} from "expo-font";
import Index from "./src";
import {Provider} from "react-native-paper"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function App() {
    const [fontsLoaded, error] = useFonts(fonts);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 10,
            }
        }
    })

    if (!fontsLoaded) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <Index/>
            </Provider>
        </QueryClientProvider>
    );
}

