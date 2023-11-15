import { Learnable } from './progress'

export type Position = {
    col?: (Learnable | Position)[]
    'col?'?: (Learnable | Position)[]
    row?: (Learnable | Position)[]
    'row?'?: (Learnable | Position)[]
}

export type Word = {
    [word: string]: {
        rank: string
        freq: string
        reading: string
        furigana: [
            {
                ruby: string
                rt: string
            }
        ]
        meaning: string[]
    }
}

export type GlyphDictType = {
    [char in Learnable]: {
        glyph: Learnable
        code: string
        comps: {
            order: Learnable[]
            position?: Position
            warnings: string[]
            occur: number
            derived: string[]
            parent: string[]
        }
        order: {
            book_rank: number
        }
        words: {
            simple: Word
            advanced: Word
        }
        meanings: {
            primary: string
            secondary: string[]
        }
        grading: {
            jlpt: number
            kanken: number
        }
    }
}
