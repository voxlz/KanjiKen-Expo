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
import HelpBox from "./src/components/HelpBox";
import HealthContextProvider from "./src/contexts/HealthContextProvider";

export default function App() {
  let [fontsLoaded] = useFonts({
    NotoSansJP_100Thin,
    // NotoSansJP_300Light,
    NotoSansJP_400Regular,
    // NotoSansJP_500Medium,
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
        <HealthContextProvider>
          <DragContextProvider>
            <ChallengeContextProvider>
              <CompKanjiChallenge />
              {/* <View className="justify-center self-stretch items-center flex-grow  w-full">
              <View className="h-20 w-20">
                <HelpBox meaning="hello">
                  <Outline text="a" />
                </HelpBox>
              </View>
            </View> */}
            </ChallengeContextProvider>
          </DragContextProvider>
        </HealthContextProvider>
      </GestureHandlerRootView>
    </View>
  );
}
