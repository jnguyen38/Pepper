import {PixelRatio, StyleSheet} from 'react-native';

function getFont(size) {
    const fontScale = PixelRatio.getFontScale()
    return size/fontScale;
}

module.exports = StyleSheet.create({
    white: {color: "white"},
    black: {color: "black"},
    red: {color: "red"},
    grey: {color: "#333333"},
    lightgrey: {color: "#cccccc"},
    pepper: {color: "#6464f6"},
    disabled: {color: "#ffffff22"},
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
    pRegular: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-Regular',
        lineHeight: getFont(15)
    },
    pItalics: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-LightItalic',
        lineHeight: getFont(15)
    },
    pBold: {
        fontSize: getFont(14),
        fontFamily: 'Epilogue-SemiBold',
        lineHeight: getFont(15)
    },
    desc: {
        fontSize: getFont(13),
        fontFamily: 'Epilogue-ExtraLight',
    },
    descRegular: {
        fontSize: getFont(13),
        fontFamily: 'Epilogue-Regular',
    },
    descMedium: {
        fontSize: getFont(13),
        fontFamily: 'Epilogue-Medium',
    },
    descBold: {
        fontSize: getFont(13),
        fontFamily: 'Epilogue-SemiBold',
    },
    small: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-ExtraLight'
    },
    smallRegular: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-Regular'
    },
    smallBold: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-Medium'
    },
    smallBoldItalics: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-MediumItalic'
    },
    smallItalics: {
        fontSize: getFont(12),
        fontFamily: 'Epilogue-LightItalic'
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