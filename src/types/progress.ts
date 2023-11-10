import { learnOrder } from '../data/learnOrder'

// Keep track of your progress on different memerables: glyphs, vocabulary, grammar?, sentences?
export type ProgressDict = {
    [memerable: string]: Progress
}

export interface Progress {
    // Track what characters you have confused with this one
    skills: Partial<{ [name in Skills]: Skill }>
    confusables?: {}
}

export interface GlyphProgress extends Progress {
    skills: {
        compose?: Skill<Level.LVL1 | Level.MAX>
        recognize?: Skill
        draw: Skill
    }
}

export interface VocabProgress extends Progress {
    skills: {
        spell: Skill
        pronounce: Skill
    }
}

export type Skills =
    | keyof VocabProgress['skills']
    | keyof GlyphProgress['skills']
export type Learnable = (typeof learnOrder)[number]

// Possible levels values for all skills
export enum Level {
    'UNSEEN', // Not seen before
    'LVL1',
    'LVL2',
    'LVL3',
    'MAX', // Highest level for this skill
}

/**
 * Each skill is connected to a specific exercise.
 * Each skill can be leveled up and should be tested individually.
 */
export type Skill<Level = {}> = {
    level: Level.UNSEEN | Level // Determines how much help you will get during the exercise. 0 means you have not yet seen it before
    seen_at: Date[] // Ancient -> Recent
}
