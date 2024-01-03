# TODO

## Open

### Issues

| #id | Prio | Description                                                                                                                             |
| --- | ---- | --------------------------------------------------------------------------------------------------------------------------------------- |
| #?? | 1    | 30 Keywords missing are missing                                                                                                         |
| #?? | 1    | Unique keywords for all characters                                                                                                      |
| #?? | 0    | Full-width glyphs for all characters (Commission a font person?)                                                                        |
| #?? | 0    | Programmatically filter out radicals (non joyo) that have few occurrences (like <3) like 开  (only used in 形)                          |
| #?? | 0    | Deal with characters that mix radicals and strokes. 皮 composition. (又 exists, rest not) 可 composition  (口 exists, rest not)         |
| #?? | 0    | 井 (Well) keyword ambiguous                                                                                                             |
| #?? | 0    | No question marks (prefer warnings)                                                                                                     |
| #?? | 0    | Order does not work if the same character appears twice (need to know which one is which in position)                                   |
| #?? | 0    | lose is ambiguous. can mean "to fail" and "to lose" and is sometimes confused with loose, avoid these types of words?                   |
| #?? | -1   | 愛 has 4 vertical components. Invent new radical? (𤔠, 𩰣, 爱, 受 all also have the first 2 components, but none of them are joyo kanji.) |

## Changelog

### v0.5.0

#### Issues

| #id | Prio | Description                                                                                           |
| --- | ---- | ----------------------------------------------------------------------------------------------------- |
| #?? | -    | Improved composition data of: 表 (Surface), 鬲 (Tripod)                                               |
| #?? | -    | Fixed issue with 一 being considered a stroke while calculating composition, affecting 来 for example |

### v0.4.0

#### Internal

| #id | Prio | Description |
| --- | ---- | ----------- |

#### Issues

| #id | Prio | Description                                                |
| --- | ---- | ---------------------------------------------------------- |
| #?? | -    | Improved composition data of: \n事 (Matter), 立 (Stand up) |

### v0.3.0

#### Internal

| #id | Prio | Description                                                                                                |
| --- | ---- | ---------------------------------------------------------------------------------------------------------- |
| #?? | -    | Remove /" from json before saving to file (might actually just be the issue of me pasting it as a string.) |
| #?? | -    | Updated export process. f5 to run python, generates .ts files in ../output                                 |

#### Issues

| #id | Prio | Description                                              |
| --- | ---- | -------------------------------------------------------- |
| #?? | -    | 天 (Heaven) missing composition                          |
| #?? | -    | ⨅ and ⿙ are now considered homoglyphs                    |
| #?? | -    | ㇀ is a stroke and should not be in learn order          |
| #?? | -    | Bad data made 八 (eight) show up to early in learn order |
| #?? | -    | Fixed 冖 ("" -> "crown")  and 36 other missing keywords  |
| #?? | -    | Updated 口, 日, 目 to use ⿙ in composition               |
| #?? | -    | ク and 𠂊 are now considered homoglyphs                   |
| #?? | -    | 亠 and 丄 are now considered homoglyphs                  |
| #?? | -    | ⺘ and 才 are now considered homoglyphs                   |
| #?? | -    | ⺲ and 皿 are now considered homoglyphs                   |
| #?? | -    | 艹 and 卄 are now considered homoglyphs                  |
| #?? | -    | 𠆢 and 人 are now considered homoglyphs                   |

### v0.2.0

#### Internal

| #id | Prio | Description |
| --- | ---- | ----------- |

#### Issues

| #id | Prio | Description                                     |
| --- | ---- | ----------------------------------------------- |
| #?? | -    | 年 (Year) missing composition                   |
| #?? | -    | 本 (Book) missing composition                   |
| #?? | -    | 牛 (Cow) missing composition                    |
| #?? | -    | 幺 (Thread) missing keyword                     |
| #?? | -    | 可 (Can) keyword is ambiguous (Can -> Approval) |
| #?? | -    | 亻 (Person) missing keyword                     |
| #?? | -    | 前 (in front) should have composition           |
| #?? | -    | 分 (Part) part should be 8 + sword, no?         |
| #?? | -    | 中 (Inside) should have composition             |
| #?? | -    | 来 (Come) missing composition                   |
| #?? | -    | 大 (Big) missing composition                    |
| #?? | -    | ヨ (yo) keyword misspelled (jo -> yo)           |
| #?? | -    | 井 (Well) wrong composition                     |

### v0.1.1

#### Internal

| #id | Prio | Description                                          |
| --- | ---- | ---------------------------------------------------- |
| #?? | -    | Have a glyph field in every glyphInfo (Code quality) |

#### Issues

| #id | Prio | Description                                                                          |
| --- | ---- | ------------------------------------------------------------------------------------ |
| #?? | -    | 米 not a compound, horns + tree                                                      |
| #?? | -    | ㇁ get's considered as a kanji, should be a stroke.                                  |
| #?? | -    | Broken position 歴                                                                   |
| #?? | -    | 冫(two stroke Water radical / ice radical) managed to sneak in a (NO. 15) definition |
| #?? | -    | legs radical was called "legs (radical no. XX)"                                      |
| #?? | -    | 弱 (Weak) composition looks wrong.                                                   |
| #?? | -    | 亼 (Person with floor) currently has a "." in it's description. Breaks style guide.  |
| #?? | -    | 威 has wrong reduction                                                               |
| #?? | -    | 出 has wrong composition 山 凵 -> 屮 凵                                              |
| #?? | -    | 𡗗 has no keyword.                                                                    |

### v0.1.0

#### Internal

| #id | Prio | Description |
| --- | ---- | ----------- |

#### Issues

| #id | Prio | Description                |
| --- | ---- | -------------------------- |
| #?? | -    | Initialized the dictionary |
