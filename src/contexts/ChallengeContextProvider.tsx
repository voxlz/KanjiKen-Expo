import React, { FC, useState } from "react";
import { glyphDictType, glyphDict } from "../data_loading/glyphDict";

type ChallengeContextType = {
  setGlyph?: (glyph: glyphDictType[0]) => void;
  getNextAnswer?: () => string | undefined;
  checkAnswer?: (input?: string) => boolean;
};

export const ChallengeContext = React.createContext<ChallengeContextType>({});

/** Keeps track of challenge specific stats, like what is the correct answer and is challenge compleated. */
const ChallengeContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [correctOrder, setCorrectOrder] = useState<string[]>();
  const [orderIdx, setOrderIdx] = useState(0);
  const [glyphInfo, setGlyphInfo] = useState<glyphDictType[0]>();

  const setGlyph = (glyph: glyphDictType[0]) => {
    setGlyphInfo(glyph);
    setCorrectOrder(glyph.comps.order);
    setOrderIdx(0);
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
    if (newOrderIdx === correctOrder?.length) finished();
    else setOrderIdx(newOrderIdx);
  };

  const finished = () => {
    console.log("finish");
  };

  const context = {
    setGlyph,
    getNextAnswer,
    checkAnswer,
  };
  return <ChallengeContext.Provider value={context} children={children} />;
};

export default ChallengeContextProvider;
