# TODO - Kanjiken Expo

<!-- Next id -->
<script>
node
const file = require('node:fs').readFileSync('TODO.md', 'utf8')
Math.max.apply(null, file.match(/\d+/g));
</script>

Use the the following versioning system: vs.m.b
- s: Stable. New stable release.
- m: Minor change. Includes some features and issues. 
- b: Bug change. Fixes issues with the program. 

## Open

### Features

| #id | Prio | Description                                                   |
| --- | ---- | ------------------------------------------------------------- |
| #19 | ^    | Modal popups (tutorial, confirmation, changelog)              |
| #32 | ^    | Health Regen                                                  |
| #28 | -    | Hint system on misstake                                       |
| #27 | -    | Placement test                                                |
| #26 | -    | Progress overview view                                        |
| #25 | -    | Game over view / popup                                        |
| #24 | -    | Daily Streak Counter system                                   |
| #23 | -    | XP level system to track progress                             |
| #22 | -    | Word exercises (Learn kanji pronouncation + Basic vocabulary) |
| #31 | -    | Dictionary skill filter                                       |

### Issues

| #id | Prio | Description                                                                                                |
| --- | ---- | ---------------------------------------------------------------------------------------------------------- |
| #21 | -    | Ensure that updated kanji exercises get added / removed from / into the scheduler on startup after update. |
| #18 | -    | Click char -> click goal drag or click on single component exercises                                       |
| #15 | -    | Confirmation on dangourus actions. (Like deleting save)                                                    |
| #30 | ^    | Dropoff hitboxes could be more forgiving. (Drag gesture)                                                   |
| #13 | -    | Show resoanble choices for the first few kanji. Currently random.                                          |
| #12 | -    | Help popup. Show help popups when as they are relevant. (SRS usage, Order matters, Radical  decomposition) |
| #11 | -    | Add dictionary defintion to english word. (High english proficiency should not be required)                |
| #10 | -    | Show similar kanji as alternatives                                                                         |
| #9  | -    | Daily goal: Introduce a "win" condition! (15 min / day)                                                    |
| #7  | -    | Don't introduce character before certain proficiency has been reached on it's components.                  |
| #6  | -    | Duplicate characters all fade out in composition, even if only one was used.                               |


## Changelog

### v0.1.2

#### Features

| #id | Prio | Description                                     |
| --- | ---- | ----------------------------------------------- |
| #29 | ^    | Added Discovery Section (See all learned kanji) |


#### Issues

| #id | Prio | Description                                                                                         |
| --- | ---- | --------------------------------------------------------------------------------------------------- |
| #17 | ^    | Z-fighting sometimes resulted in missed dropoffs on drag gesture.                                   |
| #16 | ^    | Exiting partway through an excercise may lead to broken visuals.                                    |
| #14 | ^    | Damage on dropping on filled drop locations.                                                        |
| #32 | -    | Drop gesture now checks for box-position instead of finger pos. Should make dragging more reliable. |
| #33 | ^    | Drag hitboxes could be more forgiving. (Drag gesture)                                               |


### v0.1.1

#### Features

| #id | Prio | Description                                  |
| --- | ---- | -------------------------------------------- |
| #20 | ^    | Data persistance: Now saves progress to disk |

#### Issues

| #id | Prio | Description                                                             |
| --- | ---- | ----------------------------------------------------------------------- |
| #1  | ^    | Double pressing continue will advance 2 exercises.                      |
| #2  | ^    | Composition kanji don't get an "intro" screen                           |
| #3  | ^    | Space out intro and first exercise                                      |
| #4  | ^    | Intro buttons are clickable even when opacity 0.                        |
| #5  | ^    | Possible to see next answer for a split second after pressing continue. |
| #8  | ^    | Remove answer from choices in "compose" exercise.                       |
