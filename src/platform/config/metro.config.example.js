/**
 * Metro Bundler Configuration for React Native
 * 
 * Copy this to your React Native project root as metro.config.js
 * 
 * This configuration enables:
 * - Platform-specific file extensions (.web.tsx, .native.tsx, etc.)
 * - Module resolution for the platform layer
 * - Optimized bundling
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Source file extensions
    sourceExts: [
      'tsx',
      'ts',
      'jsx',
      'js',
      'json',
      'cjs',
      'mjs',
    ],
    
    // Asset file extensions
    assetExts: [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'webp',
      'svg',
      'ttf',
      'otf',
      'woff',
      'woff2',
      'mp4',
      'mp3',
    ],
    
    // Platform-specific extensions (order matters!)
    // Metro will look for files in this order:
    // 1. Component.ios.tsx
    // 2. Component.native.tsx
    // 3. Component.tsx
    platforms: ['ios', 'android', 'native', 'web'],
    
    // Enable symlinks (useful for monorepos)
    unstable_enableSymlinks: true,
  },
  
  transformer: {
    // Babel transformer options
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    
    getTransformOptions: async () => ({
      transform: {
        // Inline requires for better performance
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  
  // Watcher options
  watchFolders: [
    // Add additional folders to watch if needed
    // Useful for monorepos or shared packages
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
