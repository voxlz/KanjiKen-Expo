export type Position = {
    col?: (string | Position)[]
    'col?'?: (string | Position)[]
    row?: (string | Position)[]
    'row?'?: (string | Position)[]
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
    [char: string]: {
        glyph: string
        code: string
        comps: {
            order: string[]
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
