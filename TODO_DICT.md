# TODO

## Open

### aaaa

#### Issues

| #id | Prio | Description                                     |
| --- | ---- | ----------------------------------------------- |
| #?? | -    | 天 (Heaven) missing composition                 |
| #?? | -    | 井 (Well) ambigous                              |
| #?? | -    | 八 (Eigth) is suspiciously high in learn order  |
| #?? | -    | ㇀ is a stroke and should not be in learn order |

#### Changes that would simplify front-end

- [ ] Remove /" from json before saving to file (might actually just be the issue of me pasting it as a string.)
- [ ] No question marks (prefer warnings)
- [ ] Order does not work if the same character appears twice (need to know which one is which in position)
- [ ] Stand up could be decomposed

#### Database mistakes to fix

- [ ] lose is ambiguous. can mean "to fail" and "to lose" and is sometimes confused with loose, avoid these types of words?
- [ ] 愛 has 4 vertical components. Invent new radical?
  - 𤔠, 𩰣, 爱, 受 all also have the first 2 components, but none of them are joyo kanji. Merge them?

#### Ignore for now

- [ ] 皮 should probably have composition - Bottom part exists 又 but top part does not. Ignore for now.
- [ ] 可 bryts inte ner ordenligt, because stroke order is wierd. 口 exists but stroke order says "one" "mouth" "hook".

## Changelog

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
