import { GlyphDictType } from '../types/glyphDict'
import { Learnable } from '../types/progress'
import charDictJsonStr from '../../dict/output/glyphDict.json'

/** Load the glyph dict */
const glyphDictLoader = (): GlyphDictType => {
    const startTime = performance.now()
    const json = JSON.parse(charDictJsonStr as string)
    const endTime = performance.now()
    console.log(`Call to JSON.parse took ${endTime - startTime} milliseconds.`)
    return json
}

/** Export glyph dict */
export const glyphDict = glyphDictLoader()

/** Provide an API to get glyphInfo */
export const getGlyphInfo = (glyph: Learnable) => {
    const info = glyphDict[glyph]
    if (!info)
        console.warn(
            'failed to get glyph info. Is the glyphDict properly loaded?'
        )
    return info
}