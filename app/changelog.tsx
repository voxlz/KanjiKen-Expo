import React, { FC } from 'react'
import ChangeLog from '../src/modals/ChangeLog'
import { router } from 'expo-router'

type Props = {}

/** Changelog page */
const changelog: FC<Props> = ({}) => (
    <>
        <ChangeLog onDismiss={() => router.back()} />
    </>
)

export default changelog
