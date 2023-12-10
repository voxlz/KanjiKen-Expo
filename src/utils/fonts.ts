export const font = (text?: string, font?: string) =>
    text && ['⿖', '⿗', '⿘', '⿙', '⿚'].includes(text.trim())
        ? 'KanjiKen-Regular'
        : font ?? 'klee-bold'
