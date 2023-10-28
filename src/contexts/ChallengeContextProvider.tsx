import React, { FC, useContext, useEffect, useState } from "react";
import { glyphDictLoader, glyphDictType } from "../data_loading/glyphDict";
import { DragContext } from "./DragContextProvider";

type ChallengeContextType = {
  setGlyph?: (glyph?: string) => void;
  getNextAnswer?: () => string | undefined;
  checkAnswer?: (input?: string) => boolean;
  isFinished: boolean;
  glyphInfo?: glyphDictType[0];
  challengeId: number;
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
  const [gd, setGd] = useState<glyphDictType>();
  const [correctOrder, setCorrectOrder] = useState<string[]>();
  const [orderIdx, setOrderIdx] = useState(0);
  const [glyphInfo, setGlyphInfo] = useState<glyphDictType[0]>();
  const [isFinished, setIsFinished] = useState(false);
  const [challengeId, setChallengeId] = useState(0); // Used to keep apart different challanges. Used in key's for example.

  const setGlyph = (glyph?: string) => {
    let newGd;

    // Load glyphDict if not already loaded
    if (!gd) {
      newGd = glyphDictLoader();
      setGd(newGd);
    } else {
      newGd = gd;
    }

    // Load glyphInfo
    let info;
    if (!glyph) {
      const possibleGlyphs = Object.keys(newGd);
      const randIdx = () => Math.floor(Math.random() * possibleGlyphs.length);
      do {
        glyph = possibleGlyphs.at(randIdx());
        info = newGd[glyph!];
        console.log("pos", info.comps.position, info.glyph);
      } while (!info?.comps.position);

      console.log(glyph);
    }

    // Update state
    if (info) info.glyph = glyph;
    setGlyphInfo(info);
    setCorrectOrder(info?.comps.order);
    setOrderIdx(0);
    setIsFinished(false);
    clearDropRects?.();
    setChallengeId((id) => id + 1);
  };

  const getNextAnswer = () => correctOrder?.[orderIdx];

  const checkAnswer = (input?: string) => {
    if (input === getNextAnswer()) {
      next();
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
    checkAnswer,
    isFinished,
    glyphInfo,
    challengeId,
  };
  return <ChallengeContext.Provider value={context} children={children} />;
};

export default ChallengeContextProvider;
