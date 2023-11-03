import React, { FC, useContext, useEffect, useState } from "react";
import {
  glyphDictLoader,
  GlyphDictType as GlyphDictType,
} from "../data_loading/glyphDict";
import { DragContext } from "./DragContextProvider";
import { shuffle } from "../functions/shuffle";
export type GlyphInfo = GlyphDictType[0];

type ChallengeContextType = {
  setGlyph?: (glyph?: string) => void;
  getNextAnswer?: () => string | undefined;
  isGlyphNext?: (input?: string) => boolean;
  advanceOrder?: () => void;
  isFinished: boolean;
  glyphInfo?: GlyphDictType[0];
  challengeId: number;
  alts?: GlyphInfo[];
  getGlyphInfo?: (glyph: string, dict?: GlyphDictType) => GlyphInfo;
};

export const ChallengeContext = React.createContext<ChallengeContextType>({
  isFinished: false,
  challengeId: 0,
});

/** Keeps track of challenge specific stats, like what is the correct answer and is challenge compleated. */
const ChallengeContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { clearDropContext: clearDropRects } = useContext(DragContext);
  const [glyphDict, setGlyphDict] = useState<GlyphDictType>();
  const [correctOrder, setCorrectOrder] = useState<string[]>();
  const [orderIdx, setOrderIdx] = useState(0);

  const [glyphInfo, setGlyphInfo] = useState<GlyphInfo>();
  const [isFinished, setIsFinished] = useState(false);
  const [challengeId, setChallengeId] = useState(0); // Used to keep apart different challanges. Used in key's for example.
  const [alts, setAlts] = useState<GlyphInfo[]>([]);

  const getGlyphInfo = (glyph: string, dict?: GlyphDictType) => {
    const d = dict ? dict : glyphDict!;
    const info = d[glyph];
    info.glyph = glyph;
    return info;
  };

  const getRandomGlyphInfo = (dict: GlyphDictType) => {
    const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length);
    const possibleGlyphs = Object.keys(dict);
    const glyph = possibleGlyphs.at(randIdx())!;
    return getGlyphInfo(glyph, dict);
  };

  const setGlyph = (glyph?: string) => {
    let dict = glyphDict;

    // Load glyphDict if not already loaded
    if (!dict) {
      dict = glyphDictLoader();
      setGlyphDict(dict);
    }

    // Load glyphInfo
    let info: GlyphInfo;
    if (!glyph) {
      do {
        info = getRandomGlyphInfo(dict);
      } while (!info?.comps.position);
    } else {
      info = getGlyphInfo(glyph, dict);
    }

    // Set alts
    let altInfos = info.comps.order.map((alt) => getGlyphInfo(alt, dict!));
    let findRandom = 8 - altInfos.length;
    do {
      altInfos = altInfos.concat(getRandomGlyphInfo(dict));
      findRandom -= 1;
    } while (findRandom > 0);
    setAlts(shuffle(altInfos));

    // Update state
    setGlyphInfo(info);
    setCorrectOrder(info?.comps.order);
    setOrderIdx(0);
    setIsFinished(false);
    clearDropRects?.();
    setChallengeId((id) => id + 1);
  };

  const getNextAnswer = () => correctOrder?.[orderIdx];

  const isGlyphNext = (input?: string) => {
    if (!input) return false;

    if (input === getNextAnswer()) {
      return true;
    } else {
      return false;
    }
  };

  const next = () => {
    const newOrderIdx = orderIdx + 1;
    setOrderIdx(newOrderIdx);
    if (newOrderIdx === correctOrder?.length) setIsFinished(true);
  };

  const context = {
    setGlyph,
    getNextAnswer,
    advanceOrder: next,
    isGlyphNext,
    isFinished,
    glyphInfo,
    challengeId,
    alts,
    getGlyphInfo,
  };
  return <ChallengeContext.Provider value={context} children={children} />;
};

export default ChallengeContextProvider;
