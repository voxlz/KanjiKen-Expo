/** Clamp a number to a certain range */
export function clamp(_: { min: number; value: number; max: number }) {
    return Math.max(_.min, Math.min(_.value, _.max))
}
