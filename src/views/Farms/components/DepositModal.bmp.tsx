import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Modal, LinkExternal, CalculateIcon, IconButton, Skeleton } from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { logError } from 'utils/sentry'
import { FloatLayout } from 'components/FloatLayout'

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
  goAddLiquidity?: () => void
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  stakedBalance,
  onConfirm,
  onDismiss,
  tokenName = '',
  multiplier,
  displayApr,
  lpPrice,
  lpLabel,
  apr,
  addLiquidityUrl,
  cakePrice,
  goAddLiquidity,
}) => {
  const [val, setVal] = useState('')
  const { toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const lpTokensToStake = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const usdToStake = lpTokensToStake.times(lpPrice)

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
    apr,
    earningTokenPrice: cakePrice.toNumber(),
  })

  const annualRoi = cakePrice.times(interestBreakdown[3])
  const annualRoiAsNumber = annualRoi.toNumber()
  const formattedAnnualRoi = formatNumber(
    annualRoi.toNumber(),
    annualRoi.gt(10000) ? 0 : 2,
    annualRoi.gt(10000) ? 0 : 2,
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      // if (e.currentTarget.validity.valid) {
      setVal(e.currentTarget.value.replace(/,/g, '.'))
      // }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        linkLabel={t('Get %symbol%', { symbol: lpLabel })}
        stakingTokenBalance={stakedBalance.plus(max)}
        stakingTokenSymbol={tokenName}
        stakingTokenPrice={lpPrice.toNumber()}
        earningTokenPrice={cakePrice.toNumber()}
        apr={apr}
        multiplier={multiplier}
        displayApr={displayApr}
        linkHref={addLiquidityUrl}
        isFarm
        initialValue={val}
        onBack={() => setShowRoiCalculator(false)}
        jumpToLiquidity={goAddLiquidity}
      />
    )
  }

  return (
    <FloatLayout title={t('Stake LP tokens')} onDismiss={onDismiss}>
      <view style={{ padding: '20px' }}>
        <ModalInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
          jumpToLiquidity={goAddLiquidity}
          inputTitle={t('Stake')}
        />
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t('Annual ROI at current rates')}:
          </Text>
          {Number.isFinite(annualRoiAsNumber) ? (
            <AnnualRoiContainer
              alignItems="center"
              onClick={() => {
                setShowRoiCalculator(true)
              }}
            >
              <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
              <IconButton variant="text" scale="sm">
                <CalculateIcon color="textSubtle" width="18px" />
              </IconButton>
            </AnnualRoiContainer>
          ) : (
            <Skeleton width={60} />
          )}
        </Flex>
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t('Cancel')}
          </Button>
          <Button
            width="100%"
            disabled={
              pendingTx || !lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)
            }
            onClick={async () => {
              setPendingTx(true)
              try {
                await onConfirm(val)
                onDismiss()
              } catch (e) {
                logError(e)
                toastError(
                  t('Error'),
                  t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
                )
              } finally {
                setPendingTx(false)
              }
            }}
          >
            {pendingTx ? t('Confirming') : t('Confirm')}
          </Button>
        </ModalActions>
        <view style={{ display: 'flex', justifyContent: 'center' }}>
          <LinkExternal
            onClick={() => {
              goAddLiquidity()
              onDismiss()
            }}
            style={{ alignSelf: 'center' }}
          >
            {t('Get %symbol%', { symbol: tokenName })}
          </LinkExternal>
        </view>
      </view>
    </FloatLayout>
  )
}

export default DepositModal
