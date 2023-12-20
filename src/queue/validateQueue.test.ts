// import { Progress, ScheduleHandler } from "../ScheduleHandler"
// import { Exercise, Learnable } from "../types/progress"
// import { createExercise } from "./exercise"

// describe('Validate queue after update', () => { 
//     test('should replace order of unseen glyphs', () => {
//         const learnOrder: Learnable[] = ["十","二","三", "人"]
//         const queue: Exercise[] = [
//             createExercise("人", "intro"),
//             createExercise("十", "recognize", 4), // Seen before
//             createExercise("二", "intro"),
//             createExercise("三", "intro"),
//         ]
//         const progress: Progress = {
//             "十": { skills: { "recognize": 4 } }
//         }
    
//         const scheduler = new ScheduleHandler(progress)
//         scheduler.initSchedule(queue)
//         const shedule = scheduler.validate(learnOrder).map(exe => exe.glyph)
//         expect(shedule).toEqual(["二","十","三", "人"])
//     })
//  })