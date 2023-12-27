import {
    createDownloadResumable,
    documentDirectory,
    readAsStringAsync,
} from 'expo-file-system'
import { encode, decode } from 'js-base64'
import { UserData } from './userDataUtils'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

export const saveToCloud = (userData: UserData) => {
    console.log('SAVE TO CLOUD')

    const reference = storage().ref(
        `/userData/${auth().currentUser?.uid}.json.txt`
    )
    const jsonStr = encode(JSON.stringify(userData))
    reference
        .putString(jsonStr, 'raw', {
            cacheControl: 'no-store', // disable caching
        })
        .then(
            () => console.log('Save to cloud: Success'),
            () => console.warn('rejected')
        )
}

export const getFromCloud = async () => {
    console.log('GET FROM CLOUD')

    const downloadURL = await storage()
        .ref(`/userData/${auth().currentUser?.uid}.json.txt`)
        .getDownloadURL()

    try {
        const downloadResult = await createDownloadResumable(
            downloadURL,
            documentDirectory + `${auth().currentUser?.uid}.json.txt`
        ).downloadAsync()

        if (downloadResult) {
            const { uri } = downloadResult
            const str = await readAsStringAsync(uri)
            const userData = JSON.parse(decode(str)) as UserData
            return userData
        }
    } catch (e) {
        console.error(e)
    }
}
