import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import text from "../../js/text";
import styles from "../../styles/modules/main/Add.module.css";
import root from "../../styles/Root.module.css";
import {CustomSafeAreaView, FocusAwareStatusBar} from "../../js/util";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from "react-native-reanimated";
import add from "../../../assets/add-white.png";
import {useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import Checkbox from 'expo-checkbox';
import {addCircle} from "../../../server/add";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SECTION_WIDTH = SCREEN_WIDTH - 40;

export default function AddScreen(props) {
    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const dots = [0, 1, 2];

    return (
        <View style={root.statusBar}>
            <LinearGradient colors={["#1b7dea", '#822cd2']}
                            start={{x:0, y:0.6}}
                            end={{x:1, y:0.4}}
                            style={root.linearBackground}/>
            <FocusAwareStatusBar barStyle={"light-content"} hidden={false} animated={true}/>


            <CustomSafeAreaView>
                <View style={styles.container}>
                    <Animated.ScrollView contentContainerStyle={styles.scrollView}
                                         scrollEventThrottle={16}
                                         ref={scrollRef}
                                         onScroll={() => Keyboard.dismiss()}
                                         horizontal
                                         pagingEnabled
                                         snapToAlignment={"center"}>
                        <AddCircle {...props}/>
                        <AddEvent/>
                        <AddPost/>
                    </Animated.ScrollView>

                    <View style={styles.dotContainer}>
                        {dots.map(dot => {
                            const inputRange = [(dot - 1) * SCREEN_WIDTH, dot * SCREEN_WIDTH, (dot + 1) * SCREEN_WIDTH]
                            const animatedStyle = useAnimatedStyle(() => {
                                return {
                                    width: interpolate(
                                        scrollOffset.value,
                                        inputRange,
                                        [12, 30, 12],
                                        Extrapolate.CLAMP
                                    ),
                                    backgroundColor: interpolateColor(
                                        scrollOffset.value,
                                        inputRange,
                                        ["#ffffff66", "#fff", "#ffffff66"],
                                    )
                                }
                            })

                            return (
                                <Animated.View key={dot} style={[styles.dot, animatedStyle]}/>
                            )
                        })}
                    </View>
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

function AddCircle(props) {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [cover, setCover] = useState(undefined);
    const [logo, setLogo] = useState(undefined);
    const [title, setTitle] = useState("");
    const [community, setCommunity] = useState("");
    const [desc, setDesc] = useState("");
    const [isPublic, setIsPublic] = useState(true)
    const [contactSport, setContactSport] = useState(false)
    const [individualSport, setIndividualSport] = useState(false)
    const [teamSport, setTeamSport] = useState(false)
    const [extremeSport, setExtremeSport] = useState(false)
    const [accessibleSport, setAccessibleSport] = useState(false)
    const [travelSport, setTravelSport] = useState(false)
    const [science, setScience] = useState(false)
    const [literature, setLiterature] = useState(false)
    const [philosophy, setPhilosophy] = useState(false)
    const [theology, setTheology] = useState(false)
    const [business, setBusiness] = useState(false)
    const [politicalScience, setPoliticalScience] = useState(false)
    const [engineering, setEngineering] = useState(false)
    const [careerDevelopment, setCareerDevelopment] = useState(false)
    const [entertainment, setEntertainment] = useState(false)
    const [gaming, setGaming] = useState(false)

    const athleticAttributes = [
        {
            value: individualSport,
            setValue: setIndividualSport,
            title: "Individual Sport"
        },
        {
            value: teamSport,
            setValue: setTeamSport,
            title: "Team Sport"
        },
        {
            value: contactSport,
            setValue: setContactSport,
            title: "Contact Sport"
        },
        {
            value: extremeSport,
            setValue: setExtremeSport,
            title: "Extreme Sport"
        },
        {
            value: accessibleSport,
            setValue: setAccessibleSport,
            title: "Accessible"
        },
        {
            value: travelSport,
            setValue: setTravelSport,
            title: "Travel"
        },
    ]
    const academicAttributes = [
        {
            value: science,
            setValue: setScience,
            title: "Science"
        },
        {
            value: literature,
            setValue: setLiterature,
            title: "Literature"
        },
        {
            value: business,
            setValue: setBusiness,
            title: "Business"
        },
        {
            value: politicalScience,
            setValue: setPoliticalScience,
            title: "Political Science"
        },
        {
            value: engineering,
            setValue: setEngineering,
            title: "Engineering"
        },
        {
            value: philosophy,
            setValue: setPhilosophy,
            title: "Philosophy"
        },
        {
            value: theology,
            setValue: setTheology,
            title: "Theology"
        },
    ]
    const miscAttributes = [
        {
            value: careerDevelopment,
            setValue: setCareerDevelopment,
            title: "Career Development"
        },
        {
            value: entertainment,
            setValue: setEntertainment,
            title: "Entertainment"
        },
        {
            value: gaming,
            setValue: setGaming,
            title: "Gaming"
        },
    ]

    async function pickImage(callback) {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.3,
        })

        if (!result.canceled) {
            callback(result.assets[0].uri)
            console.log(typeof (result.assets[0]))
        }
    }

    function toggleSwitch() {
        setIsPublic(curr => !curr)
    }

    function clearFields() {
        setTitle("")
        setCommunity("")
        setDesc("")
        setCover(undefined)
        setLogo(undefined)
        setAccessibleSport(false)
        setIndividualSport(false)
        setTeamSport(false)
        setExtremeSport(false)
        setContactSport(false)
        setTravelSport(false)
        setScience(false)
        setLiterature(false)
        setBusiness(false)
        setPoliticalScience(false)
        setEngineering(false)
        setPhilosophy(false)
        setTheology(false)
        setCareerDevelopment(false)
        setEntertainment(false)
        setGaming(false)
    }

    function handleCreate() {
        setLoading(true)
        addCircle(community, title, desc, cover, logo, isPublic, {
            individualSport,
            teamSport,
            extremeSport,
            contactSport,
            accessibleSport,
            travelSport,
            science,
            literature,
            business,
            politicalScience,
            engineering,
            philosophy,
            theology,
            careerDevelopment,
            entertainment,
            gaming
        }).then(() => {
            const circle = `${community} ${title}`
            clearFields()
            setLoading(false)
            props.
            console.log("Successfully created a circle")
            props.navigation.navigate("NewCircle", {circle: circle})
        }).catch(err => {
            setLoading(false)
            console.log(err)
        })
    }

    useEffect(() => {
        setDisabled(!title || !community || !cover || !logo)
    }, [title, community, cover, logo])

    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create a Circle</Text>
            <ScrollView contentContainerStyle={styles.scrollViewPage} style={{width: "100%"}} showsVerticalScrollIndicator={false}>
                <Text style={[text.pBold, text.pepper, {width: "100%"}]}>General Information</Text>
                <View style={{width: "100%"}}>
                    <Text style={[text.smallBold, text.pepper, {marginBottom: 5}]}>Community <Text style={[text.fine, text.pepper]}>(Required)</Text></Text>
                    <TextInput style={styles.textInput}
                               placeholder={'e.g. "Notre Dame"'}
                               placeholderTextColor={"#888"}
                               value={community}
                               onChangeText={text => setCommunity(text)}/>
                </View>
                <View style={{width: "100%"}}>
                    <Text style={[text.smallBold, text.pepper, {marginBottom: 5}]}>Title <Text style={[text.fine, text.pepper]}>(Required)</Text></Text>
                    <TextInput style={styles.textInput}
                               placeholder={'e.g. "Bengal Bouts"'}
                               placeholderTextColor={"#888"}
                               value={title}
                               onChangeText={text => setTitle(text)}/>
                </View>
                <View style={{width: "100%"}}>
                    <Text style={[text.smallBold, text.pepper, {marginBottom: 5}]}>Description <Text style={[text.fine, text.pepper]}>(Optional)</Text></Text>
                    <TextInput style={[styles.textInput, {height: 100}]}
                               placeholder={"Description"}
                               placeholderTextColor={"#888"}
                               value={desc}
                               multiline={true}
                               textContentType={"none"}
                               onChangeText={text => setDesc(text)}/>
                </View>

                <Text style={[text.pBold, text.pepper, {width: "100%", marginTop: 10}]}>Media</Text>
                <View style={styles.imageRow}>
                    <View>
                        <Text style={[text.smallBold, text.pepper, {marginBottom: 5}]}>Cover Image <Text style={[text.fine, text.pepper]}>(Required)</Text></Text>
                        <TouchableOpacity onPress={() => pickImage(setCover)} style={[styles.pickImage, styles.coverRatio]}>
                            {cover ? (
                                <Image source={{ uri: cover }} style={styles.pickedImage} />
                            ) : (
                                <View style={styles.defaultImage}>
                                    <Image source={add} style={{height: "30%", aspectRatio: "1/1"}}/>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[text.smallBold, text.pepper, {marginBottom: 5}]}>Logo <Text style={[text.fine, text.pepper]}>(Required)</Text></Text>
                        <TouchableOpacity onPress={() => pickImage(setLogo)} style={styles.pickImage}>
                            {logo ? (
                                <Image source={{ uri: logo }} style={styles.pickedImage} />
                            ) : (
                                <View style={styles.defaultImage}>
                                    <Image source={add} style={{height: "30%", aspectRatio: "1/1"}}/>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[text.pBold, text.pepper, {width: "100%", marginTop: 10}]}>Options/Attributes <Text style={[text.small, text.pepper]}>(Optional)</Text></Text>
                <View style={styles.row}>
                    <Switch
                        trackColor={{false: '#eee', true: '#6464f6'}}
                        thumbColor={"white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isPublic}/>
                    <Text style={[text.smallBold, text.pepper]}>{isPublic ? "Public" : "Private"} Circle</Text>
                </View>
                <Text style={[text.smallBold, text.pepper, {width: "100%", marginTop: 10}]}>Athletics</Text>
                <View style={styles.checkboxHolder}>
                    {athleticAttributes.map((check, index) => <CircleCheckBox check={check} key={index}/>)}
                </View>
                <Text style={[text.smallBold, text.pepper, {width: "100%", marginTop: 10}]}>Academics</Text>
                <View style={styles.checkboxHolder}>
                    {academicAttributes.map((check, index) => <CircleCheckBox check={check} key={index}/>)}
                </View>
                <Text style={[text.smallBold, text.pepper, {width: "100%", marginTop: 10}]}>Miscellaneous</Text>
                <View style={styles.checkboxHolder}>
                    {miscAttributes.map((check, index) => <CircleCheckBox check={check} key={index}/>)}
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.createButton} disabled={disabled} onPress={handleCreate}>
                    <LinearGradient colors={[disabled ? "#1b7dea44" : "#1b7deaff", disabled ? '#822cd244' : '#822cd2ff']}
                                    start={{x:0, y:0.6}}
                                    end={{x:1, y:0.4}}
                                    style={[root.linearBackground, root.rounded5]}/>
                    {loading ? (
                        <ActivityIndicator size={"small"} color={"white"}/>
                    ) : (
                        <Text style={[text.button, text.white]}>Create Circle</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

function CircleCheckBox(props) {
    return (
        <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.8}
                          onPress={() => props.check.setValue(curr => !curr)}>
            <Checkbox value={props.check.value}
                      style={styles.checkbox}
                      onValueChange={() => props.check.setValue(curr => !curr)}
                      color={"#6464f6"}/>
            <Text style={[text.smallBold, text.pepper]}>{props.check.title}</Text>
        </TouchableOpacity>
    )
}

function AddPost(props) {
    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create a Post</Text>
        </View>
    )
}

function AddEvent(props) {
    return (
        <View style={[styles.scrollSection, {width: SECTION_WIDTH}]}>
            <Text style={[text.h1, text.pepper]}>Create an Event</Text>
        </View>
    )
}