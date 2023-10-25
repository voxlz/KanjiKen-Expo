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
import AltTray from "./src/components/AltTray";

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

  const alts = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <View className="flex-1 bg-white" onLayout={onLayoutRootView}>
      <GestureHandlerRootView>
        <StatusBar style="auto" />
        <DragContextProvider>
          <View className="flex-col items-center py-20 px-9 gap-y-4 bg-yellow-500 w-full h-full">
            <DropLocation text="a">
              <Outline text="a" />
            </DropLocation>
            <Draggable>
              <Interactable text="a" />
            </Draggable>
            {/* <View
              className="flex flex-col justify-center"
              style={{ position: "relative" }} // needed for z-index to matter
            >
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
            <View className="w-full ">
              <View className="flex-row bg-red-500 z-10">
                {alts
                  .map((alt) => ({ glyph: alt }))
                  .filter((v, i) => i < 4)
                  .map((alt) => (
                    <Alternative text={alt.glyph} />
                  ))}
              </View>
              <View className="flex-row bg-red-300 relative items-center z-10 justify-between">
                {alts
                  .map((alt) => ({ glyph: alt }))
                  .filter((v, i) => i > 3)
                  .map((alt) => (
                    <Alternative text={alt.glyph} />
                  ))}
              </View>
            </View> */}
          </View>
        </DragContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
