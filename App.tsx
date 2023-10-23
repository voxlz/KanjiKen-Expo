import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import {
  useFonts,
  NotoSansJP_100Thin,
  NotoSansJP_300Light,
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
  NotoSansJP_700Bold,
  NotoSansJP_900Black,
} from "@expo-google-fonts/noto-sans-jp";
import {
  KleeOne_400Regular,
  KleeOne_600SemiBold,
} from "@expo-google-fonts/klee-one";
import * as SplashScreen from "expo-splash-screen";
import Interactable from "./src/displays/Interactable";
import Outline from "./src/displays/Outline";
import { useCallback } from "react";
import Draggable from "./src/components/Draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DragContextProvider from "./src/contexts/DragContextProvider";
import DropLocation from "./src/components/DropLocation";
import Alternative from "./src/components/Alternative";

export default function App() {
  let [fontsLoaded] = useFonts({
    NotoSansJP_100Thin,
    NotoSansJP_300Light,
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
    NotoSansJP_700Bold,
    NotoSansJP_900Black,
    KleeOne_400Regular,
    KleeOne_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-white" onLayout={onLayoutRootView}>
      <GestureHandlerRootView>
        <StatusBar style="auto" />
        <DragContextProvider>
          <View
            className="flex flex-col justify-center items-center gap-y-4 w-full h-full"
            style={{ position: "relative" }} // needed for z-index to matter
          >
            <View className="h-64 w-64 bg-red-50 relative items-center z-10">
              <Alternative text={"x"} />
            </View>
            <View className="h-64 w-64 bg-blue-50 items-center z-0">
              <DropLocation text="a">
                <Outline text="a" />
              </DropLocation>
              <DropLocation text="b">
                <Outline text="b" style={{ height: 128 }} />
              </DropLocation>
              <DropLocation text="c">
                <Outline text="c" style={{ height: 128, width: 56 }} />
              </DropLocation>
            </View>
          </View>
        </DragContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
