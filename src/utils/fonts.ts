export const font = (text?: string, defaultFont?: string) =>
    text && ['⿖', '⿗', '⿘', '⿙', '⿚'].includes(text.trim())
        ? 'KanjiKen-Regular'
        : defaultFont ?? 'noto-reg'
