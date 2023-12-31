# TODO

Use the the following versioning system: vs.m.b

- s: Stable / Milestone release.
- m: Feature release.
- b: Hotfix. Fixes issues with the program.

## Open

### Features

| #id | Prio | Desn | Description                                                                                              |
| --- | ---- | ---- | -------------------------------------------------------------------------------------------------------- |
| #?? | -    | No   | Ads after dying / Refil?                                                                                 |
| #23 | -    | No   | XP level system to track progress                                                                        |
| #22 | -    | Yes  | Word exercises (Learn kanji pronunciation + Basic vocabulary)                                            |
| #22 | -    | No   | Hiragana + Katakana exercises (Learn pronunciation + Basic vocabulary)                                   |
| #10 | -    |      | Show similar kanji as alternatives                                                                       |
| #26 | -    |      | Progress overview view                                                                                   |
| #27 | -    |      | Kanji level Placement / Fluency test                                                                     |
| #28 | -    |      | Hint system on mistake                                                                                   |
| #12 | -    |      | Help popup. Show help popups when as they are relevant. (SRS usage, Order matters, Radical  composition) |
| #31 | -    | Yes  | Dictionary skill filter                                                                                  |
| #24 | -    |      | Daily Streak Counter system                                                                              |
| #9  | -    |      | Daily goal: Introduce a "win" condition! (15 min / day)                                                  |
| #11 | -    | No   | Add dictionary definition to english word. (High english proficiency should not be required)             |
| #15 | ↓    | No   | Confirmation on dangerous actions. (Like deleting save)                                                  |

### Issues

| #id | Prio | Description                                                                                                             |
| --- | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| #?? | ^    | TEST SCALE BACK ON ON ANDROID                                                                                           |
| #?? | ^    | Apple auth (malformed or timed out) error message                                                                       |
| #?? | ^    | Empty Discovery shows "Loading"                                                                                         |
| #?? | ^    | Undiscovered kanji should be "disabled"                                                                                 |
| #?? | ^    | People click on the reveal kanji as it comes in. Potential solutions: Don't have reveal button, have skip or continue?? |
| #?? | 0    | Don't show dependency kanji in choices, as it gives away the anwswer                                                    |

## Changelog

### v0.4.2

#### UpdateDesc

#### Features

| #id | Prio | Description |
| --- | ---- | ----------- |

#### Issues

| #id | Prio | Description                                                                                             |
| --- | ---- | ------------------------------------------------------------------------------------------------------- |
| #7  | -    | Fixed character intro shown before user has learned it's components.                                    |
| #13 | -    | Fixed bad choices for the first few kanji. Showed random characters before.                             |
| #13 | -    | Fixed missing character bug in the outline where dragged character used to be                           |
| #6  | -    | Fixed duplicate characters all fade out in composition, even if only one was used.                      |
| #7  | -    | Improved queue validation when database changes. Prevents stale lessons.                                |
| #?? | ^    | Fixed death triggering immedialty. Now triggers between 2 exercises (so you can learn the one your on). |
| #?? | ^    | Fixed not validating on data syncing                                                                    |
| #30 | ↓    | Improved Dropoff hitboxes (Drag gesture) to be more forgiving, especially if only 1 drop location.      |
| #30 | ↓    | Added subtle feedback for when hovering over droplocation                                               |

### v0.4.1

#### UpdateDesc

#### Features

| #id | Prio | Description |
| --- | ---- | ----------- |

#### Issues

| #id | Prio | Description                                              |
| --- | ---- | -------------------------------------------------------- |
| #?? | ^    | Fixed crash when trying to log in with emtpy email field |

### v0.4.0

#### UpdateDesc

Sync update. Bunch of bug fixes / polish. We are closing in on the first stable build. Hurray!

#### Features

| #id | Prio | Description                                                      |
| --- | ---- | ---------------------------------------------------------------- |
| #21 | -    | Added "Sign in with Apple" functionallity [iOS only]             |
| #28 | ↑    | Added Cloud backup / Device Sync (For logged in users)           |
| #21 | -    | Now validates queue on database changes. Prevents stale lessons. |

#### Issues

| #id | Prio | Description                                                                         |
| --- | ---- | ----------------------------------------------------------------------------------- |
| #?? | ^    | Fixed wrong font in kanji success box                                               |
| #?? | ↑    | Fixed hardlock crash about 8 lessons in on new save                                 |
| #?? | ↑    | Fixed icon looking zoomed in on android                                             |
| #?? | ↑    | Fixed health regen: Sensible default values for new users + improved animation      |
| #?? | ↑    | Performance optimizations                                                           |
| #11 | -    | Experemented some more with dragging accuracy. Please report if it's better / worse |
| #?? | -    | Fixed tapping does not register as wrong                                            |
| #?? | -    | Fixed tapping does not work in compose exercises                                    |

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

| #id | Prio | Description                                             |
| --- | ---- | ------------------------------------------------------- |
| #?? | ^    | You can now drag in the recognize skill as well.        |
| #?? | ^    | Fixed issue with custom radicals not rendering properly |

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
