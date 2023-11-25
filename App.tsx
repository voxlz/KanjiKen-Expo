import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Session from './src/views/Session'

// Used for web to render tailwind
// import "./src/input";

export default function App() {
    return (
        <GestureHandlerRootView className="w-full h-full max-w-full max-h-full">
            <StatusBar style="auto" />
            <Session />
        </GestureHandlerRootView>
    )
}
