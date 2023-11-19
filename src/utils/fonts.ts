export const font = (text?: string, font?: string) =>
    text && ['⿖', '⿗', '⿘', '⿙', '⿚'].includes(text)
        ? 'KanjiKen-Regular'
        : font ?? 'KleeOne_600SemiBold'
