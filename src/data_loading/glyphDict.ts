import { jsonGlyphDictStr } from "./json";

export type Position = {
  col?: (string | Position)[];
  "col?"?: (string | Position)[];
  row?: (string | Position)[];
  "row?"?: (string | Position)[];
};

export type Word = {
  [word: string]: {
    rank: string;
    freq: string;
    reading: string;
    furigana: [
      {
        ruby: string;
        rt: string;
      }
    ];
    meaning: string[];
  };
};

export type glyphDictType = {
  [char: string]: {
    glyph?: string;
    code: string;
    comps: {
      order: string[];
      position?: Position;
      warnings: string[];
      occur: number;
      derived: string[];
      parent: string[];
    };
    order: {
      book_rank: number;
    };
    words: {
      simple: Word;
      advanced: Word;
    };
    meanings: {
      primary: string;
      secondary: string[];
    };
    grading: {
      jlpt: number;
      kanken: number;
    };
  };
};

export const glyphDictLoader = (): glyphDictType => {
  var startTime = performance.now();

  const json = JSON.parse(jsonGlyphDictStr);

  var endTime = performance.now();

  console.log(`Call to JSON.parse took ${endTime - startTime} milliseconds.`);
  return json;
};
