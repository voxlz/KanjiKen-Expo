import React, { FC, useEffect } from 'react'
import App from '../App'
import { SetHealthRegenContext } from '../src/contexts/HealthContextProvider'
import { useContext } from '../src/utils/react'

type Props = {}

/** Route to the kanjiken exercise session component */
const SessionRoute: FC<Props> = ({}) => {
    const setHealthRegen = useContext(SetHealthRegenContext)
    useEffect(() => {
        setHealthRegen(0)
    }, [])

    return <App />
}

export default SessionRoute
