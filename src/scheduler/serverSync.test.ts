import ScheduleHandler from './scheduleHandler'
import { defaultUserData } from './scheduleHandler'
import * as cloudSync from './cloudSync'
import * as localSync from './localSync'

describe('Ensure backup/sync works', () => {
    const getCloud = jest.spyOn(cloudSync, 'getFromCloud')
    const setCloud = jest.spyOn(cloudSync, 'saveToCloud')
    const getLocal = jest.spyOn(localSync, 'getFromDisk')
    const setLocal = jest.spyOn(localSync, 'saveToDisk')

    beforeEach(() => {
        getCloud
            .mockClear()
            .mockImplementation(() => Promise.resolve(undefined))
        setCloud
            .mockClear()
            .mockImplementation(() => Promise.resolve(undefined))
        getLocal
            .mockClear()
            .mockImplementation(() => Promise.resolve(undefined))
        setLocal
            .mockClear()
            .mockImplementation(() => Promise.resolve(undefined))
    })

    test('Test default. No sync is needed, data should not change', async () => {
        let scheduler = new ScheduleHandler({
            ...defaultUserData,
            stats: { reviewCount: 40 },
        })

        await scheduler.syncLocal()
        await scheduler.syncCloud()

        expect(getCloud).toHaveBeenCalledTimes(1)
        expect(setCloud).toHaveBeenCalledTimes(1)
        expect(getLocal).toHaveBeenCalledTimes(1)
        expect(setLocal).toHaveBeenCalledTimes(1)
        expect(scheduler.getUserData().stats.reviewCount).toBe(40)
    })
    test('Local data newer than cloud and cashe', async () => {
        let scheduler = new ScheduleHandler({
            ...defaultUserData,
            stats: { reviewCount: 20 },
        })
        getLocal.mockImplementation(() =>
            Promise.resolve({
                ...defaultUserData,
                stats: { reviewCount: 41 },
            })
        )

        await scheduler.syncLocal()
        await scheduler.syncCloud()

        expect(getCloud).toHaveBeenCalled()
        expect(setCloud).toHaveBeenCalled()
        expect(getLocal).toHaveBeenCalled()
        expect(setLocal).toHaveBeenCalledTimes(0)
        expect(scheduler.getUserData().stats.reviewCount).toBe(41)
    })
    test('Cloud data newer than local and cashe', async () => {
        let scheduler = new ScheduleHandler({
            ...defaultUserData,
            stats: { reviewCount: 20 },
        })
        getLocal.mockImplementation(() =>
            Promise.resolve({
                ...defaultUserData,
                stats: { reviewCount: 41 },
            })
        )
        getCloud.mockImplementation(() =>
            Promise.resolve({
                ...defaultUserData,
                stats: { reviewCount: 42 },
            })
        )

        await scheduler.syncLocal()
        await scheduler.syncCloud()

        expect(getCloud).toHaveBeenCalledTimes(1)
        expect(setCloud).toHaveBeenCalledTimes(0)
        expect(getLocal).toHaveBeenCalledTimes(1)
        expect(setLocal).toHaveBeenCalledTimes(1)
        expect(scheduler.getUserData().stats.reviewCount).toBe(42)
    })
})
