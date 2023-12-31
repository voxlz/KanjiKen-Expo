import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import {
   EncodingType,
   createDownloadResumable,
   cacheDirectory,
   readAsStringAsync,
} from 'expo-file-system'
import { encode, decode } from 'js-base64'

import { UserData } from './userDataUtils'

const serverPath = () => `/userData/${auth().currentUser?.uid}.json.txt`

export const saveToCloud = (userData: UserData) => {
   if (auth().currentUser) {
      const reference = storage().ref(serverPath())
      const jsonStr = encode(JSON.stringify(userData))
      reference
         .putString(jsonStr, 'base64', {
            cacheControl: 'no-store', // disable caching
         })
         .then(
            () => console.log('Save to cloud: Success'),
            () => console.warn('rejected')
         )
   } else {
      console.log('saveToCloud failed: User not logged in')
   }
}

export const getFromCloud = async () => {
   return auth().currentUser !== null
      ? await storage()
           .ref(serverPath())
           .getDownloadURL()
           .then((downloadURL) =>
              createDownloadResumable(
                 downloadURL,
                 cacheDirectory + `${auth().currentUser?.uid}.json.txt`
              ).downloadAsync()
           )
           .then((downloadResult) => {
              if (downloadResult) {
                 const { uri } = downloadResult
                 return readAsStringAsync(uri, {
                    encoding: EncodingType.Base64,
                 })
              }
           })
           .then((str) => {
              if (str) {
                 const userData = JSON.parse(decode(str)) as UserData
                 console.log('Get from cloud: Success')
                 return userData
              }
           })
           .catch((err) => {
              console.log('Nothing to get. Returning...', err)
              return undefined
           })
      : undefined
}
