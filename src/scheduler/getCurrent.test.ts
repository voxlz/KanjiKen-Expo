import ScheduleHandler from './scheduleHandler'
import { learnedThreshold } from '../types/progress'

describe('Test getCurrent() of scheduler', () => {
   describe('General functionality', () => {
      test('should return exercise on top of stack', () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '人', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '一', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '三', level: 0, skill: 'intro', reviewed_at: [] },
            ],
         })

         expect(scheduler.getCurrent()?.glyph).toBe('人')
      })
      test('should return undefined if schedule is empty', () => {
         const scheduler = new ScheduleHandler({
            schedule: [],
         })
         expect(scheduler.getCurrent()).toBe(undefined)
      })
   })

   describe('Push back invalid glyphs', () => {
      test("Push back if dependecy isn't learned. Place behind dependecy", () => {
         console.log('START')

         // 見 depends on 目 and 儿. Should check that both are learned before introducing 見.
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '人', level: 1, skill: 'recognize', reviewed_at: [] },
               { glyph: '目', level: 2, skill: 'compose', reviewed_at: [] },
               { glyph: '一', level: 4, skill: 'recognize', reviewed_at: [] },
            ],
            progress: {
               目: { skills: { compose: learnedThreshold - 1 } },
               儿: { skills: { compose: learnedThreshold } },
            },
         })
         expect(scheduler.getCurrent()?.glyph).toBe('人')
         expect(scheduler.getSchedule().map((a) => a.glyph)).toStrictEqual([
            '人',
            '目',
            '見',
            '一',
         ])
      })
      test("Don't push back if 'learned' dependencies ", () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '人', level: 1, skill: 'recognize', reviewed_at: [] },
               { glyph: '一', level: 4, skill: 'recognize', reviewed_at: [] },
               { glyph: '目', level: 2, skill: 'compose', reviewed_at: [] },
            ],
            progress: {
               目: { skills: { compose: learnedThreshold } },
               儿: { skills: { compose: learnedThreshold + 1 } },
            },
         })
         expect(scheduler.getCurrent()?.glyph).toBe('見')
         expect(scheduler.getSchedule().map((a) => a.glyph)).toStrictEqual([
            '見',
            '人',
            '一',
            '目',
         ])
      })
      test('Should deal with missing progress', () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '人', level: 1, skill: 'recognize', reviewed_at: [] },
               { glyph: '一', level: 4, skill: 'recognize', reviewed_at: [] },
               { glyph: '目', level: 2, skill: 'compose', reviewed_at: [] },
            ],
            progress: {},
         })
         expect(scheduler.getCurrent()?.glyph).toBe('人')
         expect(scheduler.getSchedule().map((a) => a.glyph)).toStrictEqual([
            '人',
            '一',
            '目',
            '見',
         ])
      })
      test("If dependency cannot be found in queue, don't push back", () => {
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '分', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '盆', level: 0, skill: 'intro', reviewed_at: [] },
            ],
            progress: {},
         })
         expect(scheduler.getCurrent()?.glyph).toBe('見')
         expect(scheduler.getSchedule().map((a) => a.glyph)).toStrictEqual([
            '見',
            '分',
            '見',
            '盆',
         ])
      })
      test('Should push back multiple untill it finds a valid exercise', () => {
         // 見 depends on 目 and 儿. Should check that both are learned before introducing 見.
         const scheduler = new ScheduleHandler({
            schedule: [
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '見', level: 0, skill: 'intro', reviewed_at: [] },
               { glyph: '人', level: 1, skill: 'recognize', reviewed_at: [] },
               { glyph: '目', level: 2, skill: 'compose', reviewed_at: [] },
               { glyph: '一', level: 4, skill: 'recognize', reviewed_at: [] },
            ],
            progress: {
               目: { skills: { compose: learnedThreshold - 1 } },
               儿: { skills: { compose: learnedThreshold } },
            },
         })
         expect(scheduler.getCurrent()?.glyph).toBe('人')
         expect(scheduler.getSchedule().map((a) => a.glyph)).toStrictEqual([
            '人',
            '目',
            '見',
            '見',
            '見',
            '見',
            '一',
         ])
      })
   })
})
