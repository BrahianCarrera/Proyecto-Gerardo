const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

// Quitar 'svg' de los assets e incluirlo como sourceExt
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg")
config.resolver.sourceExts.push("svg")

// Usar react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer")

// Integrar con NativeWind
module.exports = withNativeWind(config, { input: "./global.css" })
