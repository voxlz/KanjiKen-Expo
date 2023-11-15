// import { GlyphInfo } from '../contexts/ChallengeContextProvider'
// import { lvlsPerSkill as LvlsPerSkill } from '../types/progress'
// import {
//     GlyphProgress,
//     Learnable,
//     LvL,
//     ProgressDict,
//     Skills,
// } from '../types/progress'

// export const progressReducer = (
//     progressDict: ProgressDict,
//     action: {
//         type: 'add' | 'review'
//         glyphInfo: GlyphInfo

//         // Review
//         skill?: Skills // What skill was reviewed
//         tries?: number // How many misstakes did they do
//         confusables?: Learnable[] // What misstake did they do
//     }
// ) => {
//     const { type, skill, tries, glyphInfo, confusables } = action
//     switch (type) {
//         case 'add': {
//             if (progressDict[glyphInfo.glyph] === undefined && glyphInfo) {
//                 // New unseen glyph: Add new entry to progress and start tracking progress
//                 let skill =
//                     glyphInfo?.comps.position === undefined
//                         ? 'recognize'
//                         : 'compose'

//                 const defaultSkill = {
//                     level: LvL.UNSEEN,
//                     reviewed_at: [],
//                 }
//                 const glyphProgress: GlyphProgress = {
//                     skills: {
//                         intro: defaultSkill,
//                         compose: skill === 'compose' ? defaultSkill : undefined,
//                         recognize:
//                             skill === 'recognize' ? defaultSkill : undefined,
//                     },
//                     created_at: new Date(),
//                 }

//                 return {
//                     ...progressDict,
//                     [glyphInfo.glyph]: glyphProgress,
//                 }
//             }
//             console.warn(
//                 `Add not possible.
//                 ${glyphInfo.glyph} already present.`
//             )
//             return progressDict
//         }
//         case 'review': {
//             const prevProg = progressDict[glyphInfo.glyph]

//             if (skill && tries && confusables && prevProg) {
//                 const glyphSkill =
//                     progressDict[glyphInfo.glyph]['skills'][skill]

//                 if (glyphSkill) {
//                     // Calculate new level
//                     const lvls = LvlsPerSkill[skill]
//                     const currLvlIdx = lvls.findIndex(
//                         (lvl) => lvl === prevProg.skills[skill]?.level
//                     )
//                     const nextLvl =
//                         currLvlIdx >= lvls.length - 1
//                             ? LvL.MAX
//                             : lvls[currLvlIdx + 1]

//                     const updatedSkill = {
//                         [skill]: {
//                             level: nextLvl,
//                         },
//                     }

//                     return {
//                         ...progressDict,
//                         [glyphInfo.glyph]: {
//                             ...progressDict[glyphInfo.glyph],
//                             skills: {
//                                 ...progressDict[glyphInfo.glyph]['skills'],
//                             },
//                         },
//                     } as ProgressDict
//                 }
//             }
//             console.warn(
//                 `Could not update progress of ${glyphInfo.glyph}.
//                 No skill (${skill}), tries (${tries}, or confusable (${confusables}) defined.`
//             )
//             return progressDict
//         }
//     }
// }
