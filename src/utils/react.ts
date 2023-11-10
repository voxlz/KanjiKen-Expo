// Put this in your global types.ts
import {
    FC,
    PropsWithChildren,
    useContext as _useContext,
    createContext as _createContext,
} from 'react'

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = {}> = FC<PropsWithChildren<P>>

export function useContext<T>(context: React.Context<T>) {
    const value = _useContext(context)
    if (value === undefined) throw new Error('context must be within provider')
    return value
}

export function createContext<T>(value: T | undefined = undefined) {
    return _createContext<T | undefined>(undefined)
}
