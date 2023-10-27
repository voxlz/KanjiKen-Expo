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
import LockSize from "./src/utils/LockSize";

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

  const alts = ["あ", "べ", "ぜ", "で", "え", "ふ", "ぐ", "へ"];

  const Dragable = (
    <View className="absolute">
      <Draggable>
        <Interactable />
      </Draggable>
    </View>
  );

  return (
    <View className="flex-1 bg-white" onLayout={onLayoutRootView}>
      <GestureHandlerRootView>
        <StatusBar style="auto" />
        <DragContextProvider>
          <View className="flex-col items-center py-20 px-9 gap-y-3 w-full h-full flex-grow">
            <View className="w-1/2 h-auto aspect-square">
              <DropLocation text="あ">
                <Outline text="あ" />
              </DropLocation>
            </View>
            <View className="flex-grow" />
            <View
              style={{ gap: 12 }}
              className="flex-row max-w-full flex-shrink flex-wrap "
            >
              {alts.map((alt) => (
                <Alternative text={alt} key={alt} />
              ))}
            </View>
          </View>
        </DragContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
