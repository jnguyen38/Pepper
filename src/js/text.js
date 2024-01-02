import { StyleSheet } from 'react-native';
import {getFont} from "./util";

module.exports = StyleSheet.create({
    white: {color: "white"},
    black: {color: "black"},
    red: {color: "red"},
    grey: {color: "#333333"},
    pepper: {color: "#6464f6"},
    h1: {
        fontSize: getFont(28),
        fontFamily: 'Epilogue-Bold'
    },
    h2: {
        fontSize: getFont(20),
        fontFamily: 'Epilogue-Bold'
    },
    h3: {
        fontSize: getFont(18),
        fontFamily: 'Epilogue-Medium'
    },
    h4: {
        fontSize: getFont(16),
        fontFamily: 'Epilogue-Medium'
    },
    pLarge: {
        fontSize: getFont(16),
        fontFamily: 'Epilogue-Light',
    },
    p: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-Light',
        lineHeight: getFont(15)
    },
    pItalics: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-LightItalic',
        lineHeight: getFont(15)
    },
    small: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-ExtraLight'
    },
    smallBold: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-Medium'
    },
    fine: {
        fontSize: getFont(10),
        fontFamily: 'Epilogue-ExtraLight'
    },
    fineBold: {
        fontSize: getFont(10),
        fontFamily: 'Epilogue-Medium'
    },
    button: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-SemiBold'
    }
})