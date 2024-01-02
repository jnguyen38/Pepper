import {
    Platform,
    StatusBar,
    Image,
    View,
    Pressable,
    TouchableHighlight,
    TouchableOpacity,
    Keyboard, TouchableWithoutFeedback
} from "react-native";
import root from "../../styles/Root.module.css";
import styles from "../../styles/modules/main/Search.module.css";
import text from "../../js/text";
import {LinearGradient} from "expo-linear-gradient";
import {CustomSafeAreaView, FocusAwareStatusBar} from "../../js/util";
import {SearchBar} from "react-native-elements";
import {useState} from "react";
import clear from "../../../assets/x-white.png";
import searchIcon from "../../../assets/search-white.png";

export default function SearchScreen(props) {
    const [search, setSearch] = useState("")

    function updateSearch(search) {
        setSearch(search)
        console.log(search)
    }

    function clearSearch() {
        setSearch("")
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={root.statusBar}>
                <LinearGradient colors={["#1b7dea", '#822cd2']}
                                start={{x:1, y:0.6}}
                                end={{x:0, y:0.4}}
                                style={root.linearBackground}/>
                <FocusAwareStatusBar barStyle={"light-content"} hidden={false} animated={true}/>


                <CustomSafeAreaView>
                    <View style={styles.container}>
                        <SearchBar containerStyle={styles.searchContainer}
                                   showCancel={true}
                                   showLoading={false}
                                   clearIcon={() =>
                                       <TouchableOpacity activeOpacity={0.5} onPress={clearSearch} style={styles.clear}>
                                           <Image source={clear} style={{width: 15, height: 15}}/>
                                       </TouchableOpacity>}
                                   searchIcon={() => <Image source={searchIcon} style={{width: 20, height: 20}}/>}
                                   inputContainerStyle={styles.searchBar}
                                   inputStyle={[text.p, text.white]}
                                   placeholderTextColor={"#ffffff88"}
                                   selectionColor={"white"}
                                   placeholder={"Search"}
                                   onChangeText={updateSearch}
                                   onClear={clearSearch}
                                   value={search}/>
                    </View>
                </CustomSafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    )
}