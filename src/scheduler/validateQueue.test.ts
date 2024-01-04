import { createExercise } from './exercise'
import ScheduleHandler, { Progress, defaultUserData } from './scheduleHandler'
import { Learnable, Exercise } from '../types/progress'

describe('Validate queue after dictionary update', () => {
   let learnOrder: Learnable[] = ['十', '二', '三', '人']
   const queue: Exercise[] = [
      createExercise('人', 'intro'),
      createExercise('十', 'recognize', 4), // Seen before
      createExercise('二', 'intro'),
      createExercise('三', 'intro'),
      createExercise('史', 'compose', 3),
   ]
   const progress: Progress = {
      十: { skills: { recognize: 4 } },
      史: { skills: { compose: 3 } },
   }

   const userData = { ...defaultUserData, progress, schedule: queue }

   let scheduler = new ScheduleHandler(userData)

   test('Check default assumption: Do nothing, order should stay the same', () => {
      scheduler = new ScheduleHandler(userData)
      const shedule = scheduler.getSchedule().map((exe) => exe.glyph)
      expect(shedule).toStrictEqual(['人', '十', '二', '三', '史'])
   })
   test('Validate should reorder intro exercises, keeping order of the others', () => {
      learnOrder = ['十', '三', '二', '人', '史']
      scheduler = new ScheduleHandler(userData)
      const schedule = scheduler.validate(learnOrder)
      expect(schedule.map((exe) => exe.glyph)).toStrictEqual([
         '三',
         '十',
         '二',
         '人',
         '史',
      ])
   })
   test('Validate should remove exercises from glyphs not in learn order', () => {
      learnOrder = ['史', '三', '人']
      scheduler = new ScheduleHandler(userData)
      const schedule = scheduler.validate(learnOrder)
      expect(schedule.map((exe) => exe.glyph)).toStrictEqual(['三', '人', '史'])
   })
   test('Validate should replace old intro exercises with the new glyphs in learn order', () => {
      learnOrder = ['史', '五', '十', '三', '人']
      scheduler = new ScheduleHandler(userData)
      const schedule = scheduler.validate(learnOrder)
      expect(schedule.map((exe) => exe.glyph)).toStrictEqual([
         '五',
         '十',
         '三',
         '人',
         '史',
      ])
   })
   test('Validate should put additional glyphs (dict has gained new glyph) at the end of the schedule', () => {
      learnOrder = ['史', '五', '十', '三', '人', '⺈', '⺕']
      scheduler = new ScheduleHandler(userData)
      const schedule = scheduler.validate(learnOrder)
      expect(schedule.map((exe) => exe.glyph)).toStrictEqual([
         '五',
         '十',
         '三',
         '人',
         '史',
         '⺈',
         '⺕',
      ])
   })
   describe('Outdated Skills', () => {
      test('should remove "recognize" skill exercise if position data exists', () => {
         console.log('TEST')
         learnOrder = ['大']
         scheduler = new ScheduleHandler({
            schedule: [
               createExercise('大', 'recognize'),
               createExercise('大', 'compose'),
            ],
            progress: {
               大: { skills: { intro: 1 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('大', 'compose')])
      })
      test('should remove "compose" skill exercise if position data does not exist', () => {
         learnOrder = ['一']
         scheduler = new ScheduleHandler({
            schedule: [
               createExercise('一', 'recognize'),
               createExercise('一', 'compose'),
            ],
            progress: {
               一: { skills: { intro: 1 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('一', 'recognize')])
      })
   })
})
