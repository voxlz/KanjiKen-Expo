import {
    Exercise,
    Learnable,
    LvL,
    lvlsPerSkill,
    requirePerSkill,
    Skills,
} from './types/progress'
import { GlyphInfo } from './contexts/ChallengeContextProvider'
import { clamp } from './utils/js'

/** Deals with the order of task, ensure that requirements are met, etc. */
export class ScheduleHandler {
    schedule: Exercise[] = []
    progress: Partial<{
        [glyph in Learnable]: { skills: Partial<{ [skill in Skills]: LvL }> }
    }> = {}

    generalInfo = (glyph: Learnable) => ({
        glyph: glyph,
        level: 0,
        reviewed_at: [],
    })

    // Factory for initializing
    constructor(glyphs: GlyphInfo[]) {
        glyphs.forEach((glyph) => {
            this.schedule.push({
                ...this.generalInfo(glyph.glyph),
                skill: 'intro',
            })
        })
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number, glyphInfo: GlyphInfo) {
        // Remove reviewed element
        const excercise = this.schedule.shift()

        if (excercise) {
            const maxLvl = lvlsPerSkill[excercise.skill]
            const newLevel = clamp({
                min: 0,
                value:
                    tries === 1
                        ? currLvl + 1
                        : tries === 2
                        ? currLvl
                        : currLvl - 1,
                max: maxLvl,
            })

            // Update exercise
            excercise.level = newLevel

            // * Update progress
            if (!this.progress[excercise.glyph]) {
                this.progress[excercise.glyph] = { skills: {} }
            }
            this.progress[excercise.glyph]!['skills'][excercise.skill] =
                newLevel

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                this.schedule.splice(newIndex, 0, excercise)
            } else if (excercise.skill === 'intro') {
                const newIndex = 3
                this.schedule.splice(newIndex, 0, {
                    ...this.generalInfo(excercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            console.log('newLevel', newLevel)
            console.log('updated progress', this.progress[excercise.glyph])
            console.log('schedule', this.schedule.slice(0, 10))
        }
    }

    /** Get the next valid exercise the user should see. */
    getNext() {
        // Find next valid element (With timeout for crash safety)
        let i = 10000
        while (i > 0) {
            i -= 1

            // Ensure skill requirements are met
            const next = this.schedule[0]
            const reqs = requirePerSkill[next.skill]

            const missingReq = reqs.find(
                (req) =>
                    req.lvl >
                    (this.progress[next.glyph]?.['skills'][req.skill] ?? 0)
            )

            if (missingReq) {
                const nextPossibleUnlockIdx = this.schedule.findIndex(
                    (exe) =>
                        exe.glyph === next.glyph && exe.skill === next.skill
                )
                const doesNotFullfillReqs = this.schedule.shift()
                if (doesNotFullfillReqs)
                    this.schedule.splice(
                        nextPossibleUnlockIdx,
                        0,
                        doesNotFullfillReqs
                    )
            } else {
                break
            }
        }

        return this.schedule[0]
    }
}
