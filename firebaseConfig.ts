import { initializeApp } from 'firebase/app'
//, getReactNativePersistence } from 'firebase/app'
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Optionally import the services that you want to use
import { initializeAuth } from 'firebase/auth'
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

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
const auth = initializeAuth(app)
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// })

console.log('FIREBASE INITIALIZED')

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
