import { Platform } from 'react-native'
import { TestIds, RequestOptions } from 'react-native-google-mobile-ads'

export const adUnitId = __DEV__
   ? TestIds.INTERSTITIAL
   : Platform.OS === 'android'
     ? 'ca-app-pub-7133855988692619/9313603413'
     : 'ca-app-pub-7133855988692619/5749934366'

export const adRequestConfig: RequestOptions | undefined = {
   requestNonPersonalizedAdsOnly: true,
   keywords: [
      'education',
      'japanese',
      'language',
      'learning',
      'chinese',
      'korean',
   ],
}
