import {
    EncodingType,
    createDownloadResumable,
    cacheDirectory,
    readAsStringAsync,
} from 'expo-file-system'
import { encode, decode } from 'js-base64'
import { UserData } from './userDataUtils'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

const serverPath = () => `/userData/${auth().currentUser?.uid}.json.txt`

export const saveToCloud = (userData: UserData) => {
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
}

export const getFromCloud = async () => {
    console.log('GET FROM CLOUD')

    return await storage()
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
                console.log('str', decode(str).slice(0, 100))
                console.log(
                    'get from cloud progress',
                    userData.stats.reviewCount
                )
                return userData
            }
        })
        .catch((err) => {
            console.log('Nothing to get. Returning...', err)
            return undefined
        })
}