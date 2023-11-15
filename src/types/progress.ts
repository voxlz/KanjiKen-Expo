import { learnOrder } from '../data/learnOrder'

// Keep track of your progress on different memerables: glyphs, vocabulary, grammar?, sentences?
export type ProgressDict = {
    [memerable: string]: GlyphProgress
}

export interface Progress {
    // Track what characters you have confused with this one
    skills: Partial<{ [name in Skills]: Skill }>
    created_at: Date
    confusables?: {}
}

export interface GlyphProgress extends Progress {
    skills: {
        [skill in Skills]?: Skill
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
export enum Lvl {
    'UNSEEN', // Not seen before
    'LVL1',
    'LVL2',
    'LVL3',
    'MAX', // Highest level for this skill
}

export const LevelsPerSkill: { [skill in Skills]: Lvl[] } = {
    intro: [Lvl.UNSEEN, Lvl.MAX],
    compose: [Lvl.UNSEEN, Lvl.LVL1, Lvl.MAX],
    recognize: [Lvl.UNSEEN, Lvl.LVL1, Lvl.MAX],
}

export const RequirePerSkill: { [skill in Skills]: Skills[] } = {
    intro: [],
    compose: ['intro'],
    recognize: ['intro'],
}

/**
 * Each skill is connected to a specific exercise.
 * Each skill can be leveled up and should be tested individually.
 */
export type Skill = {
    level: Lvl
    reviewed_at: { date: Date; tries: number; confused_with: string[] }[] // Ancient -> Recent
}
