import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserData } from './userDataUtils'

const userDataPath = 'userData'

export const saveToDisk = async (userData: UserData) => {
   // const startTime = performance.now()
   AsyncStorage.setItem(userDataPath, JSON.stringify(userData)).catch((err) =>
      console.warn('Failed to save schedule to disk', err)
   )
   // console.log(
   //     `saveToDisk() took ${performance.now() - startTime} milliseconds.`
   // )
}

export const getFromDisk = async () => {
   const userData = await AsyncStorage.getItem(userDataPath)
   if (userData) return JSON.parse(userData) as UserData
}
