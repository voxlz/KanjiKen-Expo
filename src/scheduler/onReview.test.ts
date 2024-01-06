import { createExercise } from './exercise'
import ScheduleHandler from './scheduleHandler'

describe('Test onReview() of scheduler', () => {
   describe('General Functionality', () => {
      test('should move card back 4 on level 0', () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               createExercise('⺋', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
            ],
         })
         scheduler.onReview(1)
         expect(scheduler.getSchedule().map((exe) => exe.glyph)).toStrictEqual([
            '⺈',
            '⺈',
            '⺈',
            '⺋',
            '⺈',
         ])
         expect(scheduler.getSchedule()[3].level).toBe(1)
      })
      test('should move card back 8 on level 1', () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               createExercise('⺋', 'compose', 1),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
            ],
         })
         scheduler.onReview(1)
         expect(scheduler.getSchedule().map((exe) => exe.glyph)).toStrictEqual([
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺋',
            '⺈',
            '⺈',
         ])
         expect(scheduler.getSchedule()[7].level).toBe(2)
      })
      test('should move card to end if queue shorter than distance', () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               createExercise('⺋', 'compose', 4),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
               createExercise('⺈', 'compose', 0),
            ],
         })
         scheduler.onReview(1)
         expect(scheduler.getSchedule().map((exe) => exe.glyph)).toStrictEqual([
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺈',
            '⺋',
         ])
         expect(scheduler.getSchedule()[9].level).toBe(5)
      })
      test('should lose a level if more than one try', () => {
         const scheduler = new ScheduleHandler({
            schedule: [createExercise('⺋', 'compose', 4)],
         })
         scheduler.onReview(2)
         expect(scheduler.getCurrent()?.level).toBe(3)
      })
      test('should lose a level if more than one try again', () => {
         const scheduler = new ScheduleHandler({
            schedule: [createExercise('⺋', 'compose', 4)],
         })
         scheduler.onReview(99)
         expect(scheduler.getCurrent()?.level).toBe(3)
      })
      test('should never let level go into minus', () => {
         const scheduler = new ScheduleHandler({
            schedule: [createExercise('⺋', 'compose', 0)],
         })
         scheduler.onReview(99)
         expect(scheduler.getCurrent()?.level).toBe(0)
      })
   })
})
