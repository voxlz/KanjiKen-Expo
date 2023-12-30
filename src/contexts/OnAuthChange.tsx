import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { SchedulerContext } from './SchedulerContextProvider'
import { createContext, useContext } from '../utils/react'

const OnAuthChange: FC<{ children?: ReactNode }> = ({ children }) => {
   return children
}
export default OnAuthChange
