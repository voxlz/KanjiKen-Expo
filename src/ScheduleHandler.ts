import {
    Excercise,
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
    schedule: Excercise[] = []
    progress: Partial<{
        [glyph in Learnable]: { skills: Partial<{ [skill in Skills]: LvL }> }
    }> = {}

    // load(schedule: Excercise[]) {
    //     this.schedule = schedule
    // }

    // Factory for initializing
    constructor(glyphs: GlyphInfo[]) {
        glyphs
            .sort((a, b) => a.order.book_rank - b.order.book_rank)
            .forEach((glyph) => {
                const isCompoundGlyph = !!glyph.comps.position
                const generalInfo = {
                    glyph: glyph.glyph,
                    level: 0,
                    reviewed_at: [],
                }

                this.schedule.push({
                    ...generalInfo,
                    skill: 'intro',
                })
                this.schedule.push({
                    ...generalInfo,
                    skill: isCompoundGlyph ? 'compose' : 'recognize',
                })
            })

        return
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number) {
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

            // * Update current exercise
            excercise.level = newLevel
            // skill.reviewed_at.unshift({
            //     tries: 1,
            //     confused_with: [], /
            //     date: new Date(),
            // }) // TODO

            // * Update progress
            if (!this.progress[excercise.glyph]) {
                this.progress[excercise.glyph] = { skills: {} }
            }
            this.progress[excercise.glyph]!['skills'][excercise.skill] =
                newLevel

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1)
                this.schedule.splice(newIndex, 0, excercise)
            }
        }
    }

    getNext() {
        // Find next valid element
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
