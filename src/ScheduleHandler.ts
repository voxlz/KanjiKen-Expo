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
import { learnOrder } from './data/learnOrder'
import { glyphDict } from './data/glyphDict'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

type userData = {
    schedule: Exercise[]
    progress: Partial<{
        [glyph in Learnable]: {
            skills: Partial<{
                [skill in Skills]: LvL
            }>
        }
    }>
    touched?: Date // When was this last updated
}

/** Deals with the order of task, ensure that requirements are met, etc. */
export class ScheduleHandler {
    private readonly emptyUserData: userData = {
        schedule: [],
        progress: {},
    }
    #userData: userData = this.emptyUserData
    hasSchedule = () => this.#userData.schedule === this.emptyUserData.schedule

    // Firestore backup / sync
    userDataCollection = firestore().collection('userData')
    getDocRef = () => {
        const currentUser = auth().currentUser
        if (currentUser) {
            return this.userDataCollection.doc(currentUser.uid)
        } else console.log('DocRef Error: Not authenticated')
    }

    generalInfo = (glyph: Learnable) => ({
        glyph: glyph,
        level: 0,
        reviewed_at: [],
    })

    /** Clear user data */
    clear = () => {
        this.#userData = this.emptyUserData
    }

    /** Load from disk. Ensure persistence between sessions. */
    loadFromDisk = async () => {
        try {
            const startTime = performance.now()

            // Load from disk
            const userData = await AsyncStorage.getItem('userData')
            if (userData) {
                this.#userData = JSON.parse(userData)
            } else {
                // DEPRECATED - REMOVE NEXT UPDATE
                console.log('OLD SAVE USED')
                const schedule = await AsyncStorage.getItem('schedule')
                const progress = await AsyncStorage.getItem('progress')
                if (schedule) {
                    this.#userData.schedule = JSON.parse(schedule)
                }
                if (progress) {
                    this.#userData.progress = JSON.parse(progress)
                }
            }

            if (!this.hasSchedule()) {
                this.initSchedule()
            }

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
                'userData',
                JSON.stringify(this.#userData)
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

    backupData = () => {
        if (!this.hasSchedule())
            return console.log("Can't backup: userData is not initialized")

        this.getDocRef()
            ?.set({ json: JSON.stringify(this.#userData) })
            .then(() => console.log('userData set'))
            .catch((reason) => console.log(`could not set userData: ${reason}`))
    }

    getBackupData = async () => {
        const serverData = await this.getDocRef()?.get()
        if (serverData && serverData.exists) {
            const data = serverData.data()
            if (data) return JSON.parse(data['json']) as userData
        }
    }

    initSchedule() {
        // Load default learn order
        const glyphs = learnOrder.map((glyph) => glyphDict[glyph])
        glyphs.forEach((glyph) => {
            this.#userData.schedule.push({
                ...this.generalInfo(glyph.glyph),
                skill: 'intro',
            })
        })
        this.#userData.touched = new Date()
    }

    /** Get a copy of the progress. Should not be edited. */
    getProgress() {
        return { ...this.#userData.progress }
    }

    getTouched() {
        return this.#userData.touched
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number, glyphInfo: GlyphInfo) {
        // Remove reviewed element
        const exercise = this.#userData.schedule.shift()

        if (exercise) {
            const maxLvl = lvlsPerSkill[exercise.skill]
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
            exercise.level = newLevel

            // * Update progress
            if (!this.#userData.progress[exercise.glyph]) {
                this.#userData.progress[exercise.glyph] = { skills: {} }
            }
            this.#userData.progress[exercise.glyph]!['skills'][exercise.skill] =
                newLevel

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                this.#userData.schedule.splice(newIndex, 0, exercise)
            } else if (exercise.skill === 'intro') {
                const newIndex = 3
                this.#userData.schedule.splice(newIndex, 0, {
                    ...this.generalInfo(exercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            this.#userData.touched = new Date()

            // console.log('newLevel', newLevel)
            // console.log('updated progress', this.#save.progress[excercise.glyph])
            // console.log('schedule', this.#save.schedule.slice(0, 10))

            this.saveToDisk()
        }
    }

    /** Get the next valid exercise the user should see. */
    getCurrent() {
        if (this.#userData.schedule.length === 0) this.initSchedule()

        // Find next valid element (With timeout for crash safety)
        let i = 10000
        while (i > 0) {
            i -= 1

            // Ensure skill requirements are met
            const next = this.#userData.schedule[0]
            const reqs = requirePerSkill[next.skill]

            const missingReq = reqs.find(
                (req) =>
                    req.lvl >
                    (this.#userData.progress[next.glyph]?.['skills'][
                        req.skill
                    ] ?? 0)
            )

            if (missingReq) {
                const nextPossibleUnlockIdx = this.#userData.schedule.findIndex(
                    (exe) =>
                        exe.glyph === next.glyph && exe.skill === next.skill
                )
                const doesNotFullfillReqs = this.#userData.schedule.shift()
                if (doesNotFullfillReqs)
                    this.#userData.schedule.splice(
                        nextPossibleUnlockIdx,
                        0,
                        doesNotFullfillReqs
                    )
            } else {
                break
            }
        }

        return this.#userData.schedule[0]
    }
}
