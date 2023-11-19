export const font = (text?: string, font?: string) =>
    text && ['⿖', '⿗', '⿘', '⿙', '⿚'].includes(text.trim())
        ? 'KanjiKen-Regular'
        : font ?? 'KleeOne_600SemiBold'
