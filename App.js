import fonts from "./src/js/fonts";
import {Text} from "react-native";
import {useFonts} from "expo-font";
import Index from "./src";
import {Provider} from "react-native-paper"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const [fontsLoaded, error] = useFonts(fonts);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 10, // 10 minutes
                gcTime: 1000 * 60 * 60 * 24, // 24 Hours
            }
        }
    })

    const queryPersister = createAsyncStoragePersister({
        storage: AsyncStorage
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

