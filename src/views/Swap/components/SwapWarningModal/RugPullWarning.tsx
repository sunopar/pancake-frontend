import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'

const RugPullWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Suspicious rugpull token')}</Text>
    </>
  )
}

export default RugPullWarning
