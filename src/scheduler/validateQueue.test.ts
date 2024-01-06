import { createExercise } from './exercise'
import ScheduleHandler, { Progress, defaultUserData } from './scheduleHandler'
import { Learnable, Exercise, Skills, LvL } from '../types/progress'

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

   describe('Learn Order Changed', () => {
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
         scheduler = new ScheduleHandler({
            schedule: [
               createExercise('人', 'intro'),
               createExercise('十', 'recognize', 4), // Seen before
               createExercise('二', 'intro'),
               createExercise('三', 'intro'),
               createExercise('史', 'compose', 3),
            ],
            progress: {
               史: { skills: { compose: 3 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule.map((exe) => exe.glyph)).toStrictEqual([
            '三',
            '人',
            '史',
         ])
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
      test('should remove progress for glyphs not in learnOrder', () => {
         // otherwise we add stale exercises back later during validation
         learnOrder = ['史', '五']
         scheduler = new ScheduleHandler({
            progress: {
               史: { skills: { intro: 1 } },
               五: { skills: { intro: 1 } },
               大: { skills: { intro: 1 } },
            },
         })
         scheduler.validate(learnOrder)
         expect(Object.keys(scheduler.getProgress())).toStrictEqual([
            '史',
            '五',
         ])
      })
   })

   describe('Outdated Skills', () => {
      test('should replace "recognize" skill exercise if position data exists', () => {
         console.log('TEST')
         learnOrder = ['大']
         scheduler = new ScheduleHandler({
            schedule: [createExercise('大', 'recognize', 4)],
            progress: {
               大: { skills: { intro: 1 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('大', 'compose', 4)])
      })
      test('should replace "compose" skill exercise if position data does not exist', () => {
         learnOrder = ['一']
         scheduler = new ScheduleHandler({
            schedule: [createExercise('一', 'compose', 9)],
            progress: {
               一: { skills: { intro: 1 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('一', 'recognize', 9)])
      })
      test('should not add back stale lessons', () => {
         learnOrder = ['一']
         scheduler = new ScheduleHandler({
            schedule: [],
            progress: {
               一: { skills: { intro: 1, compose: 5 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('一', 'recognize', 5)])
      })
   })
   describe('Duplicated / Missing Skills', () => {
      test('remove lower level duplicates', () => {
         learnOrder = ['大']
         scheduler = new ScheduleHandler({
            schedule: [
               createExercise('大', 'compose', 3),
               createExercise('大', 'compose', 5),
               createExercise('大', 'compose', 4),
            ],
            progress: {
               大: { skills: { intro: 1 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([createExercise('大', 'compose', 5)])
      })
      test('should add "compose" and "recognize" if intro has been seen. Add to front of queue.', () => {
         learnOrder = ['一', '大', '日', '⺋', '見']
         scheduler = new ScheduleHandler({
            schedule: [],
            progress: {
               日: { skills: { intro: 0 } }, // Dont think this is possible but hey
               一: { skills: { intro: 1 } },
               大: { skills: { intro: 1 } },
               '⺋': { skills: { intro: 1, recognize: 4 } },
               見: { skills: { intro: 1, compose: 7 } },
            },
         })
         const schedule = scheduler.validate(learnOrder)
         expect(schedule).toStrictEqual([
            createExercise('見', 'compose', 7),
            createExercise('⺋', 'recognize', 4),
            createExercise('大', 'compose'),
            createExercise('一', 'recognize'),
            createExercise('日', 'intro'),
         ])
      })
   })
   describe('Validate Progress', () => {
      // test('should remove duplicate entries of skills', () => {
      //    learnOrder = ['大']
      //    scheduler = new ScheduleHandler({
      //       schedule: [],
      //       progress: {
      //          大: {
      //             skills: {
      //                intro: 1,
      //                compose: 2,
      //                recognize: 10, // Will rename this
      //             },
      //          },
      //       },
      //    })
      //    scheduler.validate()
      //    expect(scheduler.getProgress()['大']).toEqual({
      //       skills: {
      //          intro: 1,
      //          compose: 10,
      //       },
      //    })
      // })
   })
})
