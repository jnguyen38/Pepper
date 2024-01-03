import {Image, Pressable, TouchableOpacity, View} from "react-native";
import styles from "../styles/modules/Navbar.module.css";

import home from "../../assets/navbar/home-black.png";
import group from "../../assets/navbar/group-black.png";
import add from "../../assets/navbar/add-black.png";
import search from "../../assets/navbar/search-black.png";
import profile from "../../assets/navbar/profile-black.png";
import homePurple from "../../assets/navbar/home-purple.png";
import groupPurple from "../../assets/navbar/group-purple.png";
import addPurple from "../../assets/navbar/add-purple.png";
import searchPurple from "../../assets/navbar/search-purple.png";
import profilePurple from "../../assets/navbar/profile-purple.png";

const OPACITY = 0.5;

export default function NavBar(props) {
    function updateTab(nextTab) {
        if (nextTab !== props.tab) {
            props.navigation.navigate(props.tabs[nextTab])
        } else {
            props.navigation.navigate(props.tabs[nextTab], {screen: "Home"})
        }

        props.setTab(nextTab)
    }

    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.navItem} activeOpacity={OPACITY}
                       onPress={() => updateTab(0)}>
                <Image source={props.tab === 0 ? homePurple : home} style={[{width: 20, height: 20}, styles.icon]}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} activeOpacity={OPACITY}
                       onPress={() => updateTab(1)}>
                <Image source={props.tab === 1 ? searchPurple : search} style={[{width: 30, height: 30}, styles.icon]}/>
            </TouchableOpacity>
            <View style={styles.navItem}>
                <View style={styles.add}>
                    <TouchableOpacity onPress={() => updateTab(2)} activeOpacity={OPACITY}
                                      style={styles.addTouchable}>
                        <Image source={props.tab === 2 ? addPurple : add} style={[{width: 25, height: 25}, styles.icon]}/>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.navItem} activeOpacity={OPACITY}
                       onPress={() => updateTab(3)}>
                <Image source={props.tab === 3 ? groupPurple : group} style={[{width: 35, height: 35}, styles.icon]}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} activeOpacity={OPACITY}
                       onPress={() => updateTab(4)}>
                <Image source={props.tab === 4 ? profilePurple : profile} style={[{width: 30, height: 30}, styles.icon]}/>
            </TouchableOpacity>
        </View>
    )
}