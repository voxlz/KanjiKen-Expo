# TODO

Use the the following versioning system: vs.m.b

- s: Stable / Milestone release.
- m: Feature release.
- b: Hotfix. Fixes issues with the program.

## Open

### Features

| #id | Prio | Description                                                                                              |
| --- | ---- | -------------------------------------------------------------------------------------------------------- |
| #23 | -    | XP level system to track progress                                                                        |
| #22 | -    | Word exercises (Learn kanji pronunciation + Basic vocabulary)                                            |
| #22 | -    | Hiragana + Katakana exercises (Learn pronunciation + Basic vocabulary)                                   |
| #10 | -    | Show similar kanji as alternatives                                                                       |
| #26 | -    | Progress overview view                                                                                   |
| #27 | -    | Kanji level Placement / Fluency test                                                                     |
| #28 | -    | Hint system on mistake                                                                                   |
| #12 | -    | Help popup. Show help popups when as they are relevant. (SRS usage, Order matters, Radical  composition) |
| #31 | -    | Dictionary skill filter                                                                                  |
| #24 | -    | Daily Streak Counter system                                                                              |
| #9  | -    | Daily goal: Introduce a "win" condition! (15 min / day)                                                  |
| #11 | -    | Add dictionary definition to english word. (High english proficiency should not be required)             |
 
### Issues

| #id | Prio | Description                                                                               |
| --- | ---- | ----------------------------------------------------------------------------------------- |
| #?? | ↑    | Hardlock crash about 8 lessons in on new save                                             |
| #18 | -    | Click char -> click goal drag or click on single component exercises                      |
| #13 | -    | Show resonable choices for the first few kanji. Currently random.                         |
| #7  | -    | Don't introduce character before certain proficiency has been reached on it's components. |
| #6  | -    | Duplicate characters all fade out in composition, even if only one was used.              |
| #30 | ↓    | Dropoff hitboxes could be more forgiving. (Drag gesture)                                  |
| #15 | ↓    | Confirmation on dangerous actions. (Like deleting save)                                   |

## Changelog

### v0.4.0

#### UpdateDesc

Sync update.

#### Features

| #id | Prio | Description                                                                                                |
| --- | ---- | ---------------------------------------------------------------------------------------------------------- |
| #28 | ↑    | Cloud backup / Device Sync (For logged in users)                                                           |
| #21 | -    | Ensure that updated kanji exercises get added / removed from / into the scheduler on startup after update. |

#### Issues

| #id | Prio | Description                     |
| --- | ---- | ------------------------------- |
| #?? | ^    | Wrong font on kanji success box |

### v0.3.0

#### UpdateDesc

This update sees improvements to the health system. User authentication has also been added to
lead the way for cloud backup in a coming update. Merry Christmas!

#### Features

| #id | Prio | Description                                                         |
| --- | ---- | ------------------------------------------------------------------- |
| #32 | ↑    | Persistent Health + Passive Health Regeneration + Low Health Screen |
| #?? | ↑    | User authentication (Email, Google)                                 |

#### Issues

| #id | Prio | Description                                                    |
| --- | ---- | -------------------------------------------------------------- |
| #?? | ^    | You can now drag in the recognize skill as well.               |
| #?? | ^    | Death now triggers between 2 exercises, instead of during one. |
| #?? | ^    | Fixed issue with custom radicals not rendering properly        |

### v0.2.0

#### Features

| #id | Prio | Description                                        |
| --- | ---- | -------------------------------------------------- |
| #29 | ^    | Added Discovery Section \n(See all learned kanji)  |
| #33 | ^    | Added change log. Shows on startup of new version. |

#### Issues

| #id | Prio | Description                                                                                              |
| --- | ---- | -------------------------------------------------------------------------------------------------------- |
| #17 | ^    | Z-fighting sometimes resulted in missed dropoffs on drag gesture.                                        |
| #16 | ^    | Exiting the session partway through an exercise may lead to broken visuals.                              |
| #14 | ^    | Damage on dropping on already filled drop locations.                                                     |
| #32 | -    | Drop gesture now checks for box-position instead of finger position. Should make dragging more reliable. |
| #33 | ^    | Drag hitboxes are now more forgiving. \n(Drag gesture)                                                   |
| #33 | ^    | Removed delete progress button. \n(For now, just reinstall the app)                                      |

### v0.1.1

#### Issues

| #id | Prio | Description                                                             |
| --- | ---- | ----------------------------------------------------------------------- |
| #1  | ^    | Double pressing continue will advance 2 exercises.                      |
| #2  | ^    | Composition kanji don't get an "intro" screen                           |
| #3  | ^    | Space out intro and first exercise                                      |
| #4  | ^    | Intro buttons are clickable even when opacity 0.                        |
| #5  | ^    | Possible to see next answer for a split second after pressing continue. |
| #8  | ^    | Remove answer from choices in "compose" exercise.                       |

### v0.1.0

#### Features

| #id | Prio | Description                                  |
| --- | ---- | -------------------------------------------- |
| #20 | ^    | Data persistance: Now saves progress to disk |
| #?? | ^    | Added kanji composition and meaning database |
| #?? | ^    | Added skill "Recognize" to session           |
| #?? | ^    | Added skill "Compose" to session             |
| #?? | ^    | Added spaced repetition system               |
| #?? | ^    | Added drag and drop gesture                  |
