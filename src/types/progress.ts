import { learnOrder } from '../../output/learnOrder'
import { glyphDict } from '../data/glyphDict'
import { Position } from './glyphDict'

// Keep track of your progress on different memerables: glyphs, vocabulary, grammar?, sentences?
export type ProgressDict = {
   [memerable: string]: GlyphProgress
}

export interface Progress {
   // Track what characters you have confused with this one
   skills: Partial<{ [name in Skills]: Exercise }>
   created_at: Date
   confusables?: object
}

export interface GlyphProgress extends Progress {
   skills: {
      [skill in Skills]?: Exercise
   }
}

export interface VocabProgress extends Progress {
   skills: {
      // spell: Skill
      // pronounce: Skill
   }
}

export type Skills = 'intro' | 'compose' | 'recognize'
export type Learnable = (typeof learnOrder)[number]

// Possible levels values for all skills
export enum LvL {
   'UNSEEN', // Not seen before
   'LVL1',
   'LVL2',
   'LVL3',
   'LVL4',
   'LVL5', // Learned
   'LVL6',
   'LVL7',
   'LVL8',
   'LVL9',
   'MAX', // Highest level for this skill
}

export const lvlsPerSkill: { [skill in Skills]: number } = {
   intro: 1,
   compose: 10,
   recognize: 10,
}

/** This defines unlock conditions for new skills of the same glyphs */
export const requirePerSkill: {
   [skill in Skills]: { skill: Skills; lvl: number }[]
} = {
   intro: [],
   compose: [{ skill: 'intro', lvl: 1 }],
   recognize: [{ skill: 'intro', lvl: 1 }],
}

type RequireType = {
   [glyph in Learnable]?: {
      level: number
   }
}

// This object defined what needs to be present in the "progress" object before you should learn this character
export const requiredProgress = (glyph: Learnable): RequireType => {
   const dependecies: string[] = []

   const isPos = (pos: string | Position): pos is Position => {
      return typeof pos !== 'string'
   }
   const getDependeciesFromPosition = (pos: Position) => {
      Object.values(pos).forEach((arr) =>
         arr.forEach((posOrString) =>
            isPos(posOrString)
               ? getDependeciesFromPosition(posOrString)
               : dependecies.push(posOrString)
         )
      )
   }

   const position = glyphDict[glyph].comps.position
   position && getDependeciesFromPosition(position)

   const components = dependecies.map((glyph) => [
      glyph,
      { level: learnedThreshold } satisfies RequireType[Learnable],
   ])
   return Object.fromEntries(components)
}

/**
 * Each skill is connected to a specific exercise.
 * Each skill can be leveled up and should be tested individually.
 */
export type Exercise = {
   glyph: Learnable
   level: LvL
   skill: Skills
   reviewed_at: { date: Date; tries: number; confused_with: string[] }[] // Ancient -> Recent
}

export const learnedThreshold = 5
