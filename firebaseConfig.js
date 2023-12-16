import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyC53fYBuMPcfOeMFAHUNRcBGh8ALnNAtQg',
    authDomain: 'kanjiken-expo.firebaseapp.com',
    projectId: 'kanjiken-expo',
    storageBucket: 'kanjiken-expo.appspot.com',
    messagingSenderId: '664861145037',
    appId: '1:664861145037:web:3603a8d68d13e982653684',
    measurementId: 'G-HYYCCMRM5C',
}

const app = initializeApp(firebaseConfig)

initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

console.log('FIREBASE INITIALIZED')

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
