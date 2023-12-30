import { Learnable, Skills } from '../types/progress'

export const createExercise = (
   glyph: Learnable,
   skill: Skills,
   level?: number
) => {
   return {
      glyph,
      skill,
      level: level ?? 0,
      reviewed_at: [],
   }
}
