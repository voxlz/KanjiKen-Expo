import React, { FC, ReactNode, useEffect, useState } from 'react'
import { createContext, useContext } from '../utils/react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { SchedulerContext } from './SchedulerContextProvider'

const OnAuthChange: FC<{ children?: ReactNode }> = ({ children }) => {
    return children
}
export default OnAuthChange
