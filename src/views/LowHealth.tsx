import React, {
    FC,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { View } from 'react-native'
import StyledButton from '../components/StyledButton'
import Text from '../../src/components/Text'
import {
    RefreshHealthBarContext,
    RelativeHealthContext,
    SetHealthRegenContext,
    TimeTillFullHealthContext,
} from '../contexts/HealthContextProvider'
import { useContext } from '../utils/react'
import { useFocusEffect } from 'expo-router'
import { useInterval } from '../hooks/useInterval'
import ClockIcon from '../../assets/icons/ph_clock-duotone.svg'
import SwordIcon from '../../assets/icons/ph_kanjiken-sword.svg'
import {
    setIsDeadContext,
    DeathContext,
} from '../contexts/HealthContextProvider'

/** View before start of session, if not full health */
const LowHealth: FC<PropsWithChildren> = ({ children }) => {
    const timeTillFullHealth = useContext(TimeTillFullHealthContext)
    const refreshHealthbar = useContext(RefreshHealthBarContext)
    const setHealthRegen = useContext(SetHealthRegenContext)
    const setDeath = useContext(setIsDeadContext)
    const death = useContext(DeathContext)

    const [enoughHealth, setEnoughHealth] = useState(true)
    const [isLoading, setIsLoading] = useState(true)

    // UPDATE HEALTHBAR
    const update = (setDeathYes: boolean) => {
        refreshHealthbar().then((health) => {
            setDeathYes && setDeath(health < 33)
            setEnoughHealth(health >= 33)
            setIsLoading(false)
        })
    }
    useEffect(() => update(true), [])
    useInterval(() => {
        if (death) {
            update(false)
        }
    }, 250)

    // REGEN
    const startRegen = useCallback(() => {
        setHealthRegen(1)
    }, [])
    useFocusEffect(startRegen)

    return (
        <>
            {death && !isLoading ? (
                <View className="items-center justify-center w-full flex-grow ">
                    <View
                        style={{ gap: 12 }}
                        className="px-8 flex-grow self-stretch"
                    >
                        <View
                            className="items-center mt-8 flex-grow justify-start"
                            style={{ gap: 8 }}
                        >
                            {enoughHealth ? <SwordIcon /> : <ClockIcon />}
                            <View className="items-center mb-16 mt-10">
                                <Text
                                    className="text-black text-2xl"
                                    style={{ fontFamily: 'noto-black' }}
                                >
                                    {enoughHealth ? 'Good to go' : 'Low Health'}
                                </Text>
                                <Text style={{ fontFamily: 'noto-reg' }}>
                                    {timeTillFullHealth()
                                        ? 'Full health will finish restoring in ' +
                                          timeTillFullHealth()
                                        : 'Full health has been restored'}
                                </Text>
                            </View>
                        </View>
                        <StyledButton
                            styleName={enoughHealth ? 'forest' : 'disabled'}
                            text={
                                enoughHealth
                                    ? 'Start Session'
                                    : 'Health to low to start'
                            }
                            onPress={() => {
                                if (enoughHealth) {
                                    setEnoughHealth(false)
                                    setDeath(false)
                                }
                            }}
                        />
                    </View>
                </View>
            ) : (
                <>{children}</>
            )}
        </>
    )
}

export default LowHealth
