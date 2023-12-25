import { Exercise, Learnable } from "../types/progress"
import { createExercise } from "./exercise"
import { Progress, ScheduleHandler } from "./scheduleHandler"

describe("Ensure backup/sync to firestore works", () => {
    let learnOrder: Learnable[] = ["人","十","二","三","四"]
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

    test("If local data is further progressed, backup to server", async () => {
        await scheduler.syncLocal()
    })
})