import { ExpoConfig, ConfigContext } from 'expo/config'

const isPROD = process.env.APP_ENV === 'production'
const identifier = isPROD ? 'com.voxlz.KanjiKen' : 'com.voxlz.KanjiKen.dev'
const androidFirebaseFile =
   process.env.GOOGLE_SERVICES_JSON ?? './keys/google-services.json'
const iosFirebaseFile =
   process.env.GOOGLE_SERVICE_INFO ?? './keys/GoogleService-Info.plist'

// loads app.json first and then runs the following, sending app.json values through config object
// Override dynamic values here!
export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   slug: config.slug!,
   name: `${config.name} ${isPROD ? '' : '(DEV)'}`,
   icon: `./assets/icon${isPROD ? '' : '-dev'}.png`,
   ios: {
      ...config.ios,
      bundleIdentifier: identifier,
      googleServicesFile: iosFirebaseFile,
   },
   android: {
      ...config.android,
      package: identifier,
      googleServicesFile: androidFirebaseFile,
      adaptiveIcon: {
         ...config.android?.adaptiveIcon,
         foregroundImage: `./assets/adaptive-icon${isPROD ? '' : '-dev'}.png`,
      },
   },
})
