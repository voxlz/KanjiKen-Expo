import { GlyphDictType } from '../types/glyphDict'
import { jsonGlyphDictStr } from './jsonGlyphDict'

export const glyphDictLoader = (): GlyphDictType => {
    const startTime = performance.now()
    const json = JSON.parse(jsonGlyphDictStr)
    const endTime = performance.now()
    console.log(`Call to JSON.parse took ${endTime - startTime} milliseconds.`)
    return json
}
