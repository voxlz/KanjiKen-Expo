import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import { router, useFocusEffect } from 'expo-router'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'

import { version } from './_layout'
import StyledButton from '../src/components/StyledButton'
import { SchedulerContext } from '../src/contexts/SchedulerContextProvider'
import { useContext } from '../src/utils/react'

/** Homepage of the application. Where you start the exercises for example. */
const Home: FC = () => {
   const [userName, setUserName] = useState<string>()
   const [userEmail, setUserEmail] = useState<string>()
   const [lastSynced, setLastSynced] = useState<string>('Not synced')
   // const [serverTouch, setServerTouch] = useState<Date>()

   const scheduler = useContext(SchedulerContext)

   const updateUserInfo = useCallback(() => {
      setUserName(
         auth().currentUser?.displayName ??
            (auth().currentUser ? 'unknown' : undefined)
      )
      setUserEmail(auth().currentUser?.email ?? undefined)
   }, [])

   useEffect(() => {
      auth().onUserChanged((user) => {
         if (user) {
            console.log('email', auth().currentUser?.email)
            updateUserInfo()
         }
      })
   }, [])

   useFocusEffect(updateUserInfo)

   // SHOW CHANGELOG IF NEW VERSION
   useEffect(() => {
      // Check if new version.
      AsyncStorage.getItem('version', (err, result) => {
         if (err) return console.log('err.cause', err.cause)

         console.log('result', result, version)

         // First time opening the app
         if (result === null || result === '') {
            console.log('first time opening the app')
            // WELCOME TO KANJIKEN
         } else if (result === version) {
            console.log('same version as last time')
         } else {
            console.log('new version')
            router.push('ChangeLog')
            scheduler.validate()
         }

         if (version) {
            AsyncStorage.setItem('version', version)
         } else {
            console.error('no version found')
         }
      })
   }, [scheduler])

   useEffect(() => {
      AsyncStorage.getItem('lastBackup').then((getTimeNum) =>
         setLastSynced(
            getTimeNum
               ? new Date(Number(getTimeNum)).toString().slice(4, -8)
               : 'Never synced'
         )
      )
   }, [])

   return (
      <>
         <View
            style={{
               flex: 1,
               alignItems: 'stretch',
               justifyContent: 'space-around',
               gap: 12,
            }}
         >
            <View style={{ gap: 12 }} className="px-8">
               <StyledButton
                  text="Start Session"
                  onPress={() => router.push('/session')}
               />
               <StyledButton
                  text="Discovered"
                  styleName="normal"
                  onPress={() => router.push('/discovery')}
               />
               <StyledButton
                  text="Changelog"
                  styleName="normal"
                  onPress={() => router.push('/ChangeLog')}
               />
               {(userEmail === 'torben.media@gmail.com' ||
                  userEmail === 'torben.nordtorp@gmail.com') && (
                  <StyledButton
                     text="Developer"
                     styleName="disabled"
                     onPress={() => router.push('/developer')}
                  />
               )}
            </View>
            {/* <View>
                    <StyledButton
                        styleName="normal"
                        text="Erase Progress"
                        onPress={() => {
                            console.log('deleted progress')
                            AsyncStorage.multiRemove(['progress', 'schedule'])
                            scheduler.clear()
                            scheduler.loadFromDisk().then(() => {
                                scheduler.initSchedule(
                                    learnOrder.map((glyph) => glyphDict[glyph])
                                )
                            })
                        }}
                    />
                </View> */}
         </View>
         <View className="items-center justify-center mb-6">
            <Text className="text-md text-ui-light">KanjiKen v{version}</Text>
            <Text className="text-md text-ui-light">
               {userName !== undefined
                  ? `Logged in as: ${userName}`
                  : 'Not logged in'}{' '}
            </Text>
            <Text className="text-md text-ui-light">
               {`${userName !== undefined ? 'Last synced: ' + lastSynced : ''}`}
            </Text>
         </View>
         <View className="mb-20 px-8">
            <StyledButton
               text={!userName ? 'Sign in' : 'Sign out'}
               styleName={!userName ? 'normal' : 'danger'}
               onPress={() => {
                  if (!userName) {
                     router.push('/auth/login')
                  } else {
                     auth()
                        .signOut()
                        .then(() => {
                           updateUserInfo()
                           scheduler.clearUserData()
                        })
                        .catch(() => console.log('Not signed in'))
                  }
               }}
            />
         </View>
      </>
   )
}

export default Home
