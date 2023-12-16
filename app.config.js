export default {
    expo: {
        name: 'Kanjiken',
        slug: 'Kanjiken',
        description:
            'A kanji trainer that makes learning all 2000+ japanese characters easy!',
        version: '0.3.0',
        android: {
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
            versionCode: 4,
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.voxlz.KanjiKen',
        },
        orientation: 'portrait',
        icon: './assets/icon.png',
        scheme: 'kanjiken',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.voxlz.KanjiKen',
            googleServicesFile: process.env.GOOGLE_SERVICE_INFO,
        },
        web: {
            favicon: './assets/favicon.png',
            bundler: 'metro',
        },
        extra: {
            eas: {
                projectId: '57852673-b0dd-4a4a-abc2-be6e438afbab',
            },
        },
        plugins: ['expo-router', '@react-native-google-signin/google-signin'],
    },
    'react-native-google-mobile-ads': {
        android_app_id: 'ca-app-pub-xxxxxxxx~xxxxxxxx',
        ios_app_id: 'ca-app-pub-xxxxxxxx~xxxxxxxx',
    },
}
