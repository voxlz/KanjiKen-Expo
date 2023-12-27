import { createExercise } from './exercise'
import ScheduleHandler from './scheduleHandler'
import { UserData } from './userDataUtils'

describe('Data Robustness. Ensure older savefiles can be read.', () => {
    test('Default values get inserted when setting and getting userdata', () => {
        const partialUserData: Partial<UserData> = {
            schedule: [createExercise('⺍', 'compose', 3)],
        }
        const userData = new ScheduleHandler(partialUserData).getUserData()
        expect(userData.touched).toBeDefined()
        expect(userData.stats.reviewCount).toBeDefined()
    })
    test('Ensure schedule does not get overwritten', () => {
        const partialUserData: Partial<UserData> = {
            schedule: [createExercise('⺍', 'compose', 3)],
        }
        const userData = new ScheduleHandler(partialUserData).getUserData()
        expect(userData.schedule).toEqual([createExercise('⺍', 'compose', 3)])
    })
})
