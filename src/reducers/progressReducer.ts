import {
    Learnable,
    Progress,
    ProgressDict,
    Skill,
    Skills,
} from '../types/progress'
export const progressReducer = (
    progressDict: ProgressDict,
    action: {
        type: 'add' | 'review'
        glyph: Learnable
        progress: Progress
        tries: number
        skill?: Skills
    }
) => {
    const { type, glyph, progress, skill, tries } = action
    switch (type) {
        case 'add': {
            if (progressDict[glyph] !== undefined)
                return { ...progressDict, [glyph]: progress }
            else {
                console.warn(
                    `Add not possible, due to ${glyph} already present.`
                )
                return progressDict
            }
        }
        case 'review': {
            if (skill && tries) {
                const glyphSkill = progressDict[glyph]['skills'][skill]
                if (glyphSkill) {

                    const updatedSkill = {
                        [skill]: {
                            level: glyphSkill['level'],
                        } as Skill,
                    }
                    
                    return {
                        ...progressDict,
                        [glyph]: {
                            ...progressDict[glyph],
                            skills: {
                                ...progressDict[glyph]['skills'],
                            },
                        },
                    } as ProgressDict
                }
            } else {
                console.warn(
                    `Could not update progress of ${glyph}. No skill (${skill}) or tries (${tries}) defined.`
                )
                return progressDict
            }
        }
    }
}
