import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, HelpIcon, Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'
import AutoEarningsBreakdown from '../../AutoEarningsBreakdown'
import { useTooltip } from 'contexts/bmp/TooltipContext'

interface AutoEarningsCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const HelpIconWrapper = styled.div`
  align-self: center;
`

const AutoEarningsCell: React.FC<AutoEarningsCellProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice } = pool

  const {
    userData: {
      isLoading: userDataLoading,
      cakeAtLastUserAction,
      userShares,
      currentOverdueFee,
      currentPerformanceFee,
      userBoostedShare,
    },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    currentPerformanceFee.plus(currentOverdueFee).plus(userBoostedShare),
  )

  const labelText = t('Recent CAKE profit')
  const earningTokenBalance = autoCakeToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay

  const { onPresent } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />)

  if (!userShares.gt(0)) {
    return null
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        {userDataLoading && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            {/* {tooltipVisible && tooltip} */}
            <Flex>
              <Box mr="8px" height="32px">
                <Balance
                  mt="4px"
                  bold={!isMobile}
                  fontSize={isMobile ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={2}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasEarnings && !isMobile && (
                <HelpIconWrapper onClick={onPresent}>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AutoEarningsCell
