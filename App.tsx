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
  glyphDict as gd,
  glyphDict,
  glyphDictType,
} from "./src/data_loading/glyphDict";
import { shuffle } from "./src/functions/shuffle";
import ChallengeContextProvider from "./src/contexts/ChallengeContextProvider";
import CompKanjiChallenge from "./src/views/CompKanjiChallenge";

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

  const [glyphDict, setGlyphDict] = useState<glyphDictType>({});

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
      <GestureHandlerRootView>
        <StatusBar style="auto" />
        <ChallengeContextProvider>
          <DragContextProvider>
            <CompKanjiChallenge />
          </DragContextProvider>
        </ChallengeContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
