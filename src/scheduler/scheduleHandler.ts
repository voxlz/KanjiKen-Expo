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
import { mostAdvancedUserData, UserData, userDataProgressCount } from './userDataUtils'
import storage from '@react-native-firebase/storage';
import { encode, decode } from 'js-base64';
import { createDownloadResumable, documentDirectory, getInfoAsync, makeDirectoryAsync, readAsStringAsync } from 'expo-file-system'

export type Progress = Partial<{
    [glyph in Learnable]: {
        skills: Partial<{
            [skill in Skills]: LvL
        }>
    }
}>



/** Deals with the order of task, ensure that requirements are met, etc. */
export class ScheduleHandler {
    #userData: UserData | undefined = undefined
    emptyUserData = {
        schedule: [],
        progress: {},
    }

    /** Get user data. If not set, initialize */ 
    getUserData = () => {
        if (!this.#userData) {
            this.#userData = this.emptyUserData
            this.initSchedule()
        }
        return this.#userData
    }

    setUserData = (userData: UserData) => {
        this.#userData = userData
    }

    /** THIS SHOULD HAPPEN BEFORE SYNC CLOUD HAS BEGUN!
     * Ensure user get's the latest data, even if it's from their last session or different device */
    async syncLocal(): Promise<UserData> {
        const currData = this.#userData
        const localData = await this.getFromDisk()

        let furthest = mostAdvancedUserData([currData, localData])

        if (!furthest) {
            furthest = this.getUserData()
        }

        this.setUserData(furthest)
        this.saveToDisk(furthest)
        
        return furthest
    }

    /** THIS SHOULD HAPPEN AFTER SYNC LOCAL IS FINISHED! 
     * Ensure user get's the latest data, even if it's from their last session or different device */
    async syncCloud(): Promise<void> {
        const currData = this.#userData
        const cloudData = await this.getFromCloud()

        const currProg = userDataProgressCount(currData)
        const cloudProg = userDataProgressCount(cloudData)

        // TODO: ProgressCount cannot look at skills since you can lose levels as well.
        if (currProg === cloudProg) {
            console.log('Cloud data is up to date')
        } else if (cloudData && cloudProg > currProg) {
            console.log('Cloud data futher than local data')
            await this.setUserData(cloudData)
            await this.saveToDisk(cloudData)
        } else {
            console.log('Local data further than cloud data')
            await this.saveToCloud(currData)
        }

        AsyncStorage.setItem("lastBackup", String(new Date().getTime()))
    }

    constructor(progress?: Progress) {
        this.setUserData({...this.getUserData(), progress: progress ?? {}})
    }

    // Firestore backup / sync
    userDataCollection = () => firestore().collection('userData')
    getDocRef = () => {
        const currentUser = auth().currentUser
        if (currentUser) {
            return this.userDataCollection().doc(currentUser.uid)
        } else console.log('DocRef Error: Not authenticated')
    }

    generalInfo = (glyph: Learnable) => ({
        glyph: glyph,
        level: 0,
        reviewed_at: [],
    })

    /** Clear user data */
    clear = () => {
        console.log('cleared userData, reinitialized the schedule')
        this.#userData = this.emptyUserData
        AsyncStorage.multiRemove(['progress', 'schedule', 'userData'])
        this.initSchedule()
    }

    /** Validate the queue after an update to the database.
     * Ensure learnOrder is correct + new exercises added + old exercises removed */
    validate = (customLearnOrder?: Learnable[]): Exercise[] => {
        const userData = this.getUserData()
        const newUserData = userData
        console.log('Validating...')
        
        const order = customLearnOrder ?? learnOrder

        // Ensure order is correct by replacing present intro skills
        const learnedGlyphs = Object.keys(
            userData.progress
        ) as Learnable[]
        
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

    getFromDisk = async () => {
        const userData = await AsyncStorage.getItem('userData')
            if (userData) {
                return JSON.parse(userData) as UserData
            }
    }

    // /** Load from disk. Ensures that schedule is initialized and persistence between sessions. */
    // loadFromDisk = async () => {
    //     try {
    //         const startTime = performance.now()

    //         // Load from disk
    //         const localUserData = this.getFromDisk()
    //         if (localUserData) {
    //             this.setUserData(localUserData)
    //         }

    //         const endTime = performance.now()
    //         console.log(
    //             `ScheduleHandler loadFromDisk() took ${
    //                 endTime - startTime
    //             } milliseconds.`
    //         )
    //     } catch (error) {
    //         console.warn('Failed to load schedule from disk', error)
    //     }
    // }

    saveToDisk = async (userData?: UserData) => {
        try {
            const startTime = performance.now()

            await AsyncStorage.setItem(
                'userData',
                JSON.stringify(userData ?? this.getUserData())
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

    saveToCloud = (userData?: UserData) => {
        console.log('SAVE TO CLOUD')
        const reference = storage().ref(`/userData/${auth().currentUser?.uid}.json.txt`);
        const jsonStr = encode(JSON.stringify(userData ?? this.getUserData()))
        reference.putString(jsonStr, "raw", {
            cacheControl: 'no-store', // disable caching
        }).then(() => console.log('Save to cloud: Success'), () => console.warn("rejected"))
    }

    getFromCloud = async () => {
        console.log('GET FROM CLOUD')

        const downloadURL = await storage().ref(`/userData/${auth().currentUser?.uid}.json.txt`).getDownloadURL();

        try {
            const downloadResult = await createDownloadResumable(
                downloadURL,
                documentDirectory + `${auth().currentUser?.uid}.json.txt`,
            ).downloadAsync();

            if (downloadResult) {
                const { uri } = downloadResult;
                const str = await readAsStringAsync(uri)
                const userData = JSON.parse(decode(str)) as UserData
                return userData
            }
        } catch (e) {
            console.error(e);
        }
    }

    initSchedule(exercises?: Exercise[]) {
        // console.log('glyph', glyphDict['⺋'])
        let newSchedule: Exercise[] = []
        if (exercises) {
            newSchedule = exercises
        } else {
            const glyphs = learnOrder.map((glyph) => glyphDict[glyph])
            glyphs.forEach((glyph) => {
                newSchedule.push({
                    ...this.generalInfo(glyph.glyph),
                    skill: 'intro',
                })
            })
        }

        this.setUserData({...this.getUserData(), schedule: newSchedule, touched: new Date()})
        console.log('finished init')
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
                userData.progress[exercise.glyph]!['skills'][exercise.skill] = newLevel
            } else {
                console.warn("ERR: Something went wrong here");
            }

            // * Insert first element at index X, remove if max-level
            if (newLevel !== maxLvl) {
                const newIndex = Math.pow(2, newLevel + 1) - 1
                userData.schedule.splice(newIndex, 0, exercise)
            } else if (exercise.skill === 'intro') {
                const newIndex = 3
                userData.schedule.splice(newIndex, 0, {
                    ...this.generalInfo(exercise.glyph),
                    skill: glyphInfo.comps.position ? 'compose' : 'recognize',
                })
            }

            userData.touched = new Date()

            this.setUserData(userData)
            this.saveToDisk(userData)
        }
    }

    /** Get the next valid exercise the user should see. */
    getCurrent() {
        if (this.getUserData().schedule.length === 0) this.initSchedule()

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
                const nextPossibleUnlockIdx = this.getUserData().schedule.findIndex(
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
