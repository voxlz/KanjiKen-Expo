import { GlyphInfo } from '../contexts/ChallengeContextProvider'
import {
    GlyphProgress,
    Level,
    ProgressDict,
    Skill,
    Skills,
} from '../types/progress'

export const progressReducer = (
    progressDict: ProgressDict,
    action: {
        type: 'add' | 'review'
        glyphInfo: GlyphInfo
        tries?: number
        skill?: Skills
    }
) => {
    const { type, skill, tries, glyphInfo } = action
    switch (type) {
        case 'add': {
            if (progressDict[glyphInfo.glyph] === undefined && glyphInfo) {
                // New unseen glyph: Add new entry to progress and start tracking progress
                let skill =
                    glyphInfo?.comps.position === undefined
                        ? 'recognize'
                        : 'compose'

                const glyphProgress: GlyphProgress = {
                    skills: {
                        compose:
                            skill === 'compose'
                                ? { level: Level.UNSEEN, reviewed_at: [] }
                                : undefined,
                        recognize:
                            skill === 'recognize'
                                ? { level: Level.UNSEEN, reviewed_at: [] }
                                : undefined,
                    },
                    created_at: new Date(),
                }

                return {
                    ...progressDict,
                    [glyphInfo.glyph]: glyphProgress,
                }
            }

            console.log(progressDict[glyphInfo.glyph], glyphInfo)

            console.warn(
                `Add not possible, due to ${glyphInfo.glyph} already present.`
            )
            return progressDict
        }
        case 'review': {
            if (skill && tries) {
                const glyphSkill =
                    progressDict[glyphInfo.glyph]['skills'][skill]
                if (glyphSkill) {
                    const updatedSkill = {
                        [skill]: {
                            level: glyphSkill['level'],
                        } as Skill,
                    }

                    return {
                        ...progressDict,
                        [glyphInfo.glyph]: {
                            ...progressDict[glyphInfo.glyph],
                            skills: {
                                ...progressDict[glyphInfo.glyph]['skills'],
                            },
                        },
                    } as ProgressDict
                }
            }
            console.warn(
                `Could not update progress of ${glyphInfo.glyph}. No skill (${skill}) or tries (${tries}) defined.`
            )
            return progressDict
        }
    }
}
