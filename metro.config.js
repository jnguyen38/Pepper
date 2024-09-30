// const { getDefaultConfig } = require("@react-native/metro-config");
//
// module.exports = (async () => {
//     const {
//         resolver: { sourceExts }
//     } = await getDefaultConfig();
//     return {
//         transformer: {
//             getTransformOptions: async () => ({
//                 transform: {
//                     experimentalImportSupport: false,
//                     inlineRequires: true,
//                 },
//             }),
//             babelTransformerPath: require.resolve("react-native-css-transformer")
//         },
//         resolver: {
//             sourceExts: [...sourceExts, "css", "cjs", "ttf"],
//             resolverMainFields: ['react-native', 'browser', 'main']
//         },
//     };
// })();

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
    resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
        babelTransformerPath: require.resolve('react-native-css-transformer'),
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg', "css", "cjs", "ttf"],
        resolverMainFields: ['react-native', 'browser', 'main']
    },
};

module.exports = mergeConfig(defaultConfig, config);