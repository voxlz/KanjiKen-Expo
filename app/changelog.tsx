import { router } from 'expo-router'
import React, { FC } from 'react'

import ChangeLog from '../src/modals/ChangeLog'

type Props = object

/** Changelog page */
const changelog: FC<Props> = ({}) => (
   <>
      <ChangeLog onDismiss={() => router.back()} />
   </>
)

export default changelog
