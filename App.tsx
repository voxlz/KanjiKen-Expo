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
import { useCallback, useEffect, useState } from "react";
import Draggable from "./src/components/Draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DragContextProvider from "./src/contexts/DragContextProvider";
import DropLocation from "./src/components/DropLocation";
import Alternative from "./src/components/Alternative";
import KanjiComps from "./src/components/KanjiComps";
import {
  glyphDictLoader as gd,
  glyphDictLoader,
  GlyphDictType,
} from "./src/data_loading/glyphDict";
import { shuffle } from "./src/functions/shuffle";
import ChallengeContextProvider from "./src/contexts/ChallengeContextProvider";
import CompKanjiChallenge from "./src/views/CompKanjiChallenge";
import TextBox from "./src/utils/TextBox";

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

  const [glyphDict, setGlyphDict] = useState<GlyphDictType>({});

  useEffect(() => {
    setGlyphDict(gd());
  }, []);

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
      <GestureHandlerRootView className="w-full h-full">
        <StatusBar style="auto" />
        <DragContextProvider>
          <ChallengeContextProvider>
            {/* <CompKanjiChallenge /> */}
            <View className="justify-center self-stretch items-center flex-grow  w-full">
              <View className="h-24 w-24">
                <Outline text="a" />
                <View
                  id="hint"
                  className="absolute bg-blue-500 h-10 w-20 left-2 -top-12 rounded-lg shadow-sm"
                ></View>
                <View
                  className="absolute w-0 h-0 border-transparent border-t-[10px] border-b-0 border-x-[10px] border-t-blue-500
                 left-9 -top-2"
                ></View>
              </View>
            </View>
          </ChallengeContextProvider>
        </DragContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
