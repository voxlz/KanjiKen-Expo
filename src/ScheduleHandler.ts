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
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

type userData = {
    schedule: Exercise[]
    progress: Partial<{
        [glyph in Learnable]: {
            skills: Partial<{
                [skill in Skills]: LvL
            }>
        }
    }>
}

/** Deals with the order of task, ensure that requirements are met, etc. */
export class ScheduleHandler {
    private readonly emptyUserData: userData = {
        schedule: [],
        progress: {},
    }
    #userData: userData = this.emptyUserData
    hasSchedule = () => this.#userData.schedule === this.emptyUserData.schedule
    getDocRef = (uid: string) => doc(getFirestore(), 'userData', uid)

    generalInfo = (glyph: Learnable) => ({
        glyph: glyph,
        level: 0,
        reviewed_at: [],
    })

    /** Clear userdata */
    clear = () => {
        this.#userData = this.emptyUserData
    }

    /** Load from disk. Ensure presistance between sessions. */
    loadFromDisk = async () => {
        try {
            const startTime = performance.now()
            await AsyncStorage.getItem('schedule').then((schedule) => {
                if (schedule) {
                    this.#userData.schedule = JSON.parse(schedule)
                    console.log(
                        'Schedule length',
                        this.#userData.schedule.length
                    )
                }
            })
            await AsyncStorage.getItem('progress').then((progress) => {
                if (progress) {
                    this.#userData.progress = JSON.parse(progress)
                    console.log(
                        'Progress length',
                        Object.keys(this.#userData.progress).length
                    )
                }
            })

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
                'schedule',
                JSON.stringify(this.#userData.schedule)
            )
            await AsyncStorage.setItem(
                'progress',
                JSON.stringify(this.#userData.progress)
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

    backupData = async () => {
        const auth = getAuth()
        if (!auth.currentUser)
            return console.log("Can't backup: User not logged in.")
        if (!this.hasSchedule())
            return console.log("Can't backup: userData is not initialized")

        setDoc(this.getDocRef(auth.currentUser.uid), {
            json: JSON.stringify(this.#userData),
        })
            .then(() => console.log('userData set'))
            .catch((reason) => console.log(`could not set userData: ${reason}`))
    }

    getBackupData = async () => {
        const auth = getAuth()
        if (!auth.currentUser)
            return console.log("Can't read backup: User not logged in.")

        const docSnap = await getDoc(this.getDocRef(auth.currentUser.uid))

        if (docSnap.exists()) {
            console.log('Found userData on server')
        } else {
            // docSnap.data() will be undefined in this case
            console.log('No such document!')
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
    }

    /** Get a copy of the progress. Should not be edited. */
    getProgress() {
        return { ...this.#userData.progress }
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number, glyphInfo: GlyphInfo) {
        // Remove reviewed element
        const excercise = this.#userData.schedule.shift()

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
            if (!this.#userData.progress[excercise.glyph]) {
                this.#userData.progress[excercise.glyph] = { skills: {} }
            }
            this.#userData.progress[excercise.glyph]!['skills'][
                excercise.skill
            ] = newLevel

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                this.#userData.schedule.splice(newIndex, 0, excercise)
            } else if (excercise.skill === 'intro') {
                const newIndex = 3
                this.#userData.schedule.splice(newIndex, 0, {
                    ...this.generalInfo(excercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            // console.log('newLevel', newLevel)
            // console.log('updated progress', this.#save.progress[excercise.glyph])
            // console.log('schedule', this.#save.schedule.slice(0, 10))

            this.saveToDisk()
        }
    }

    /** Get the next valid exercise the user should see. */
    getCurrent() {
        if (this.#userData.schedule.length === 0)
            console.warn(
                'trying to access current exercise before schedule is initialized / loaded'
            )

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
