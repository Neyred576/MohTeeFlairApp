const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    resolver: {
        // Block the Fabric (New Architecture) entry points of react-native-screens
        // when building for old architecture to avoid CodegenTypes parsing errors.
        blockList: [
            /node_modules\/react-native-screens\/src\/fabric\/.*/,
        ],
    },
};

module.exports = mergeConfig(defaultConfig, config);
