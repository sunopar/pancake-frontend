import React, { FC, ReactNode } from 'react'
import { Token } from '@pancakeswap/sdk'
import Balance from 'components/Balance'
import { Flex, Skeleton, Text, TooltipText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedLockedVaultUser, DeserializedPool } from 'state/types'
import { isLocked, isStaked } from 'utils/cakePool'
import useAvgLockDuration from './LockedPool/hooks/useAvgLockDuration'
import Apr from './Apr'
import { useTooltip } from 'contexts/bmp/TooltipContext'

const StatWrapper: FC<{ label: ReactNode }> = ({ children, label }) => {
  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center" width="100%">
      {label}
      <Flex alignItems="center">{children}</Flex>
    </Flex>
  )
}

export const PerformanceFee: FC<{ userData?: DeserializedLockedVaultUser; performanceFeeAsDecimal?: number }> = ({
  userData,
  performanceFeeAsDecimal,
}) => {
  const { t } = useTranslation()
  const { onPresent } = useTooltip(<view>{t('Performance fee only applies to the flexible staking rewards.')}</view>)

  const isLock = isLocked(userData)
  const isStake = isStaked(userData)

  if (!performanceFeeAsDecimal || isLock) {
    return null
  }

  return (
    <StatWrapper
      label={
        <TooltipText onClick={onPresent} small>
          {t('Performance Fee')}
        </TooltipText>
      }
    >
      <Text ml="4px" small>
        {isStake ? `${performanceFeeAsDecimal}%` : `0~${performanceFeeAsDecimal}%`}
      </Text>
    </StatWrapper>
  )
}

const TotalToken = ({ total, token }: { total: BigNumber; token: Token }) => {
  if (total && total.gte(0)) {
    return <Balance small value={getBalanceNumber(total, token.decimals)} decimals={0} unit={` ${token.symbol}`} />
  }
  return <Skeleton width="90px" height="21px" />
}

export const TotalLocked: FC<{ totalLocked: BigNumber; lockedToken: Token }> = ({ totalLocked, lockedToken }) => {
  const { t } = useTranslation()

  return (
    <StatWrapper label={<Text small>{t('Total locked')}:</Text>}>
      <TotalToken total={totalLocked} token={lockedToken} />
    </StatWrapper>
  )
}

export const DurationAvg = () => {
  const { t } = useTranslation()
  const { onPresent } = useTooltip(
    <view>{t('The average lock duration of all the locked staking positions of other users')}</view>,
  )

  const { avgLockDurationsInWeeks } = useAvgLockDuration()

  return (
    <StatWrapper
      label={
        <TooltipText onClick={onPresent} small>
          {t('Average lock duration')}:
        </TooltipText>
      }
    >
      <Text ml="4px" small>
        {avgLockDurationsInWeeks}
      </Text>
    </StatWrapper>
  )
}

export const TotalStaked: FC<{ totalStaked: BigNumber; stakingToken: Token }> = ({ totalStaked, stakingToken }) => {
  const { t } = useTranslation()

  const { onPresent } = useTooltip(
    <view>{t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol })}</view>,
  )

  return (
    <StatWrapper
      label={
        <TooltipText onClick={onPresent} small>
          {t('Total staked')}:
        </TooltipText>
      }
    >
      <TotalToken total={totalStaked} token={stakingToken} />
    </StatWrapper>
  )
}

export const AprInfo: FC<{ pool: DeserializedPool; stakedBalance: BigNumber }> = ({ pool, stakedBalance }) => {
  const { t } = useTranslation()
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small>{t('APR')}:</Text>
      <Apr pool={pool} showIcon stakedBalance={stakedBalance} performanceFee={0} fontSize="14px" />
    </Flex>
  )
}
