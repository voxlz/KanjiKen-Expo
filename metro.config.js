// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig(__dirname);

//   return {
//     transformer: {
//       babelTransformerPath: require.resolve("react-native-svg-transformer"),
//     },
//     resolver: {
//       assetExts: assetExts.filter((ext) => ext !== "svg"),
//       sourceExts: [...sourceExts, "svg"],
//     },
//   };
// })();

const { getDefaultConfig } = require('expo/metro-config')
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname)

// Include files from KanjiKen-Dict project under "dict" path
// https://dushyant37.medium.com/how-to-import-files-from-outside-of-root-directory-with-react-native-metro-bundler-18207a348427
// const kanjiDictPath = require('path').resolve(__dirname + '/../')
// config.resolver.extraNodeModules = { kanjiDict: kanjiDictPath }
// config.watchFolders = [kanjiDictPath]

// Override default config to allow for SVG
config.transformer.babelTransformerPath = require.resolve(
   'react-native-svg-transformer'
)
config.resolver.assetExts = config.resolver.assetExts.filter(
   (ext) => ext !== 'svg'
)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg', 'cjs']
config.resolver.assetExts = [...config.resolver.assetExts, 'md', 'txt'] // bundle md and txt files
config.watchFolders = [...config.watchFolders, 'todo']
config.resolver.blockList = [/dict\/.*/]
module.exports = config
