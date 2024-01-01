import { ExpoConfig, ConfigContext } from 'expo/config'

const identifier =
   process.env.APP_ENV === 'production'
      ? 'com.voxlz.KanjiKen'
      : 'com.voxlz.KanjiKen-dev'

// loads app.json first and then runs the following, sending app.json values through config object
// Override dynamic values here!
export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   slug: config.slug!,
   name:
      process.env.APP_ENV === 'production'
         ? config.name!
         : config.name! + ' (DEV)',
   ios: {
      ...config.ios,
      bundleIdentifier: identifier,
      googleServicesFile:
         process.env.GOOGLE_SERVICE_INFO ?? './keys/GoogleService-Info.plist',
   },
   android: {
      ...config.android,
      adaptiveIcon: {
         ...config.android?.adaptiveIcon,
         foregroundImage:
            process.env.APP_ENV === 'production'
               ? './assets/adaptive-icon.png'
               : './assets/adaptive-icon-dev.png',
      },
      package: identifier,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
   },
   icon:
      process.env.APP_ENV === 'production'
         ? './assets/icon.png'
         : './assets/icon-dev.png',
})
