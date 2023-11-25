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
import AsyncStorage from '@react-native-async-storage/async-storage'

/** Deals with the order of task, ensure that requirements are met, etc. */
export class ScheduleHandler {
    #schedule: Exercise[] = []
    #progress: Partial<{
        [glyph in Learnable]: { skills: Partial<{ [skill in Skills]: LvL }> }
    }> = {}
    hasSchedule = false

    generalInfo = (glyph: Learnable) => ({
        glyph: glyph,
        level: 0,
        reviewed_at: [],
    })

    clear = () => {
        this.#schedule = []
        this.#progress = {}
    }

    loadFromDisk = async () => {
        try {
            const startTime = performance.now()
            await AsyncStorage.getItem('schedule').then((schedule) => {
                if (schedule) {
                    this.#schedule = JSON.parse(schedule)
                    console.log('Schedule length', this.#schedule.length)
                    this.hasSchedule = true
                }
            })
            await AsyncStorage.getItem('progress').then((progress) => {
                if (progress) {
                    this.#progress = JSON.parse(progress)
                    console.log(
                        'Progress length',
                        Object.keys(this.#progress).length
                    )
                }
            })
            const endTime = performance.now()
            console.log(
                `ScheduleHandler loadFromDisk() took ${
                    endTime - startTime
                } milliseconds.`
            )
        } catch (error) {
            console.warn('Failed to load schedule from disk')
        }
    }

    saveToDisk = async () => {
        try {
            const startTime = performance.now()
            await AsyncStorage.setItem(
                'schedule',
                JSON.stringify(this.#schedule)
            )
            await AsyncStorage.setItem(
                'progress',
                JSON.stringify(this.#progress)
            )
            const endTime = performance.now()
            console.log(
                `ScheduleHandler saveToDisk() took ${
                    endTime - startTime
                } milliseconds.`
            )
        } catch (error) {
            console.warn('Failed to save schedule to disk')
        }
    }

    initSchedule(glyphs: GlyphInfo[]) {
        // Load default learn order
        glyphs.forEach((glyph) => {
            this.#schedule.push({
                ...this.generalInfo(glyph.glyph),
                skill: 'intro',
            })
        })
        this.hasSchedule = true
    }

    /** Get a copy of the progress. Should not be edited. */
    getProgress() {
        return { ...this.#progress }
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number, glyphInfo: GlyphInfo) {
        // Remove reviewed element
        const excercise = this.#schedule.shift()

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
            if (!this.#progress[excercise.glyph]) {
                this.#progress[excercise.glyph] = { skills: {} }
            }
            this.#progress[excercise.glyph]!['skills'][excercise.skill] =
                newLevel

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                this.#schedule.splice(newIndex, 0, excercise)
            } else if (excercise.skill === 'intro') {
                const newIndex = 3
                this.#schedule.splice(newIndex, 0, {
                    ...this.generalInfo(excercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            // console.log('newLevel', newLevel)
            // console.log('updated progress', this.#progress[excercise.glyph])
            // console.log('schedule', this.#schedule.slice(0, 10))

            this.saveToDisk()
        }
    }

    /** Get the next valid exercise the user should see. */
    getCurrent() {
        if (this.#schedule.length === 0)
            console.warn(
                'trying to access current exercise before schedule is initialized / loaded'
            )

        // Find next valid element (With timeout for crash safety)
        let i = 10000
        while (i > 0) {
            i -= 1

            // Ensure skill requirements are met
            const next = this.#schedule[0]
            const reqs = requirePerSkill[next.skill]

            const missingReq = reqs.find(
                (req) =>
                    req.lvl >
                    (this.#progress[next.glyph]?.['skills'][req.skill] ?? 0)
            )

            if (missingReq) {
                const nextPossibleUnlockIdx = this.#schedule.findIndex(
                    (exe) =>
                        exe.glyph === next.glyph && exe.skill === next.skill
                )
                const doesNotFullfillReqs = this.#schedule.shift()
                if (doesNotFullfillReqs)
                    this.#schedule.splice(
                        nextPossibleUnlockIdx,
                        0,
                        doesNotFullfillReqs
                    )
            } else {
                break
            }
        }

        return this.#schedule[0]
    }
}
