import { Progress, ScheduleHandler } from "./scheduleHandler"
import { createExercise } from "./exercise"
import { Learnable, Exercise } from '../types/progress';

describe('Validate queue after dictionary update', () => {
    
    let learnOrder: Learnable[] = ["十","二","三","人"]
    const queue: Exercise[] = [
        createExercise("人", "intro"),
        createExercise("十", "recognize", 4), // Seen before
        createExercise("二", "intro"),
        createExercise("三", "intro"),
        createExercise("四", "compose", 3),
    ]
    const progress: Progress = {
        "十": { skills: { "recognize": 4 } },
        "四": { skills: { "compose": 3 } }
    }

    let scheduler = new ScheduleHandler(progress)

    test('Check default assumption: Do nothing, order should stay the same', () => {
        scheduler = new ScheduleHandler(progress)
        scheduler.initSchedule(queue)
        const shedule = scheduler.getSchedule().map(exe => exe.glyph)
        expect(shedule).toStrictEqual(["人","十","二","三","四"])
    })
    test('Validate should reorder intro exercises, keeping order of the others', () => {
        learnOrder = ["十", "三", "二", "人", "四"]
        scheduler = new ScheduleHandler(progress)
        scheduler.initSchedule(queue)
        const schedule = scheduler.validate(learnOrder)
        // console.log('schedule', schedule)
        expect(schedule.map(exe => exe.glyph)).toStrictEqual(["三","十","二","人","四"])
    })
    test('Validate should remove exercises from glyphs not in learn order', () => {
        learnOrder = ["四", "三", "人", ]
        scheduler = new ScheduleHandler(progress)
        scheduler.initSchedule(queue)
        const schedule = scheduler.validate(learnOrder)
        // console.log('schedule', schedule)
        expect(schedule.map(exe => exe.glyph)).toStrictEqual(["三","人","四"])
    })
    test('Validate should replace old intro exercises with the new glyphs in learn order', () => {
        learnOrder = ["四", "五", "十", "三", "人"]
        scheduler = new ScheduleHandler(progress)
        scheduler.initSchedule(queue)
        const schedule = scheduler.validate(learnOrder)
        // console.log('schedule', schedule)
        expect(schedule.map(exe => exe.glyph)).toStrictEqual(["五","十","三","人","四"])
    })
    test('Validate should put additional glyphs (dict has gained new glyph) at the end of the schedule', () => {
        learnOrder = ["四", "五", "十", "三", "人", "⺈", "⺕"]
        scheduler = new ScheduleHandler(progress)
        scheduler.initSchedule(queue)
        const schedule = scheduler.validate(learnOrder)
        // console.log('schedule', schedule)
        expect(schedule.map(exe => exe.glyph)).toStrictEqual(["五","十","三","人","四","⺈","⺕"])
    })
 })