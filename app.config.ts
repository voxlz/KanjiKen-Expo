import { ExpoConfig, ConfigContext } from 'expo/config'

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
      bundleIdentifier:
         process.env.APP_ENV === 'production'
            ? config.ios?.bundleIdentifier!
            : config.ios?.bundleIdentifier + '-dev',
   },
})
