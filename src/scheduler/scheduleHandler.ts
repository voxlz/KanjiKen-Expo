import {
    Exercise,
    Learnable,
    LvL,
    lvlsPerSkill,
    requirePerSkill,
    Skills,
} from '../types/progress'
import { GlyphInfo } from '../contexts/ChallengeContextProvider'
import { clamp } from '../utils/js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { glyphDict } from '../data/glyphDict'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { learnOrder } from '../../output/learnOrder'
import { createExercise } from './exercise'
import { UserData, userDataProgressCount } from './userDataUtils'
import { getFromDisk, saveToDisk } from './localSync'
import { deepmerge } from 'deepmerge-ts'
import { getFromCloud, saveToCloud } from './cloudSync'

export type Progress = {
    [glyph in Learnable]?: {
        skills: Partial<{
            [skill in Skills]: LvL
        }>
    }
}

export const generalInfo = (glyph: Learnable) => ({
    glyph: glyph,
    level: 0,
    reviewed_at: [],
})

export const defaultSchedule = () => {
    let newSchedule: Exercise[] = []

    const glyphs = learnOrder.map((glyph) => glyphDict[glyph])
    glyphs.forEach((glyph) => {
        newSchedule.push({
            ...generalInfo(glyph.glyph),
            skill: 'intro',
        })
    })

    return newSchedule
}

export const defaultUserData: UserData = {
    schedule: defaultSchedule(),
    progress: {},
    stats: { reviewCount: 0 },
    touched: new Date().getTime(),
}

/** Deals with the order of task, ensure that requirements are met, etc. */
export default class ScheduleHandler {
    /** Cashed userdata. Don't access this directly */
    #userData: UserData | undefined = undefined

    /** Get user data. */
    getUserData = (): UserData => {
        // Even if you haven't used app in a while or are missing stats or userdata here, this should ensure that you always have default values.
        const userData = !this.#userData
            ? defaultUserData
            : deepmerge(defaultUserData, this.#userData)

        // Schedule should not be merged.
        userData.schedule = this.#userData?.schedule ?? defaultUserData.schedule

        return userData
    }

    setUserData = (newUserData?: Partial<UserData>) => {
        // By using this setUserData, we ensure that even if cloud or disk data is missing things we expect, the program still runs prefectly fine.
        const userData = !newUserData
            ? defaultUserData
            : deepmerge(defaultUserData, newUserData as UserData)

        // Schedule should not be merged.
        userData.schedule = newUserData?.schedule ?? defaultUserData.schedule

        this.#userData = userData
    }

    /** Clear user data */
    clearUserData = () => {
        console.log('cleared userData, reinitialized the schedule')
        this.#userData = defaultUserData
        AsyncStorage.multiRemove(['progress', 'schedule', 'userData'])
    }

    /** THIS SHOULD HAPPEN BEFORE SYNC CLOUD HAS BEGUN!
     * Ensure user get's the latest data, even if it's from their last session or different device */
    async syncLocal(): Promise<void> {
        const currData = this.getUserData()
        const localData = await getFromDisk()

        const currProg = userDataProgressCount(currData)
        const localProg = userDataProgressCount(localData)

        if (!localData) {
            console.log('No local save found. Saving to disk...')
            saveToDisk(currData)
        } else if (currProg === localProg) {
            console.log('Local save is up to date')
        } else if (currProg > localProg) {
            console.log('Local save is outdated. Saving to disk...')
            saveToDisk(currData)
        } else if (currProg < localProg) {
            console.log('Current cashe is outdated. Loading from disk...')
            this.setUserData(localData)
        }
    }

    /** THIS SHOULD HAPPEN AFTER SYNC LOCAL IS FINISHED!
     * Ensure user get's the latest data, even if it's from their last session or different device */
    async syncCloud(): Promise<void> {
        const currData = this.getUserData()
        const cloudData = await getFromCloud()

        const currProg = userDataProgressCount(currData)
        const cloudProg = userDataProgressCount(cloudData)

        if (currProg === cloudProg) {
            console.log('Cloud data is up to date')
        } else if (cloudData && cloudProg > currProg) {
            console.log('Cloud data futher than local data')
            await this.setUserData(cloudData)
            await saveToDisk(cloudData)
        } else {
            console.log('Local data further than cloud data')
            await saveToCloud(currData)
        }

        AsyncStorage.setItem('lastBackup', String(new Date().getTime()))
    }

    constructor(userData?: Partial<UserData>) {
        this.setUserData(userData)
    }

    // Firestore backup / sync
    userDataCollection = () => firestore().collection('userData')
    getDocRef = () => {
        const currentUser = auth().currentUser
        if (currentUser) {
            return this.userDataCollection().doc(currentUser.uid)
        } else console.log('DocRef Error: Not authenticated')
    }

    /** Validate the queue after an update to the database.
     * Ensure learnOrder is correct + new exercises added + old exercises removed */
    validate = (customLearnOrder?: Learnable[]): Exercise[] => {
        const userData = this.getUserData()
        const newUserData = userData
        console.log('Validating...')

        const order = customLearnOrder ?? learnOrder

        // Ensure order is correct by replacing present intro skills
        const learnedGlyphs = Object.keys(userData.progress) as Learnable[]

        const sortedUnlearnedGlyphs = order.filter(
            (glyph) => !learnedGlyphs.includes(glyph)
        )

        newUserData.schedule = newUserData.schedule.map((exe) => {
            if (exe.skill !== 'intro') return exe
            if (learnedGlyphs.includes(exe.glyph)) return exe
            return { ...exe, glyph: sortedUnlearnedGlyphs.shift()! }
        })

        // Remove exercises for glyphs no longer in learnOrder
        newUserData.schedule = newUserData.schedule.filter((exe) =>
            order.includes(exe.glyph)
        )

        // If glyphs where added in the update, there might be glyphs left in sortedUnlearned
        while (sortedUnlearnedGlyphs.length > 0) {
            newUserData.schedule.push(
                createExercise(sortedUnlearnedGlyphs.shift()!, 'intro')
            )
        }

        this.setUserData(newUserData)

        return newUserData.schedule
    }

    /** Get a copy of the progress. Should not be edited. */
    getProgress() {
        return { ...this.getUserData().progress }
    }

    /** Get a copy of the progress. Should not be edited. */
    getSchedule() {
        return this.getUserData().schedule
    }

    getTouched() {
        return this.getUserData().touched
    }

    // Let's start with a very basic scheduler. Every time you review something, it get's pushed back 2^(lvl+1) slots.
    onReview(tries: number, currLvl: number, glyphInfo: GlyphInfo) {
        // Remove reviewed element
        const exercise = this.getUserData().schedule.shift()

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
            const userData = this.getUserData()

            // * Update progress
            if (!this.getUserData().progress[exercise.glyph]) {
                userData.progress[exercise.glyph] = { skills: {} }
            }
            const glyphProgress = userData.progress[exercise.glyph]
            if (glyphProgress) {
                userData.progress[exercise.glyph]!['skills'][exercise.skill] =
                    newLevel
            } else {
                console.warn('ERR: Something went wrong here')
            }

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                userData.schedule.splice(newIndex, 0, exercise)
            } else if (exercise.skill === 'intro') {
                const newIndex = 3
                userData.schedule.splice(newIndex, 0, {
                    ...generalInfo(exercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            userData.touched = new Date().getTime()
            userData.stats.reviewCount += 1

            this.setUserData(userData)
            saveToDisk(userData)
        }
    }

    /** Get the next valid exercise the user should see. */
    getCurrent() {
        // Find next valid element (With timeout for crash safety)
        let i = 10000
        while (i > 0) {
            i -= 1

            // Ensure skill requirements are met
            const next = this.getUserData().schedule[0]
            const reqs = requirePerSkill[next.skill]

            const missingReq = reqs.find(
                (req) =>
                    req.lvl >
                    (this.getUserData().progress[next.glyph]?.['skills'][
                        req.skill
                    ] ?? 0)
            )

            if (missingReq) {
                const nextPossibleUnlockIdx =
                    this.getUserData().schedule.findIndex(
                        (exe) =>
                            exe.glyph === next.glyph && exe.skill === next.skill
                    )
                const doesNotFullfillReqs = this.getUserData().schedule.shift()
                if (doesNotFullfillReqs)
                    this.getUserData().schedule.splice(
                        nextPossibleUnlockIdx,
                        0,
                        doesNotFullfillReqs
                    )
            } else {
                break
            }
        }

        return this.getUserData().schedule[0]
    }
}