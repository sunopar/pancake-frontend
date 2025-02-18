import React, { useEffect, useCallback, useState, useMemo, useRef, useLayoutEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Input } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
// import { NextLinkFromReactRouter } from 'components/NextLink'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { isArchivedPid } from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { FarmsPage, useFarms as useFarmsWrapper } from 'views/bmp/farms/farmsContext'
import { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import { RowProps } from './components/FarmTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema } from './components/types'
import { getSystemInfo, useDidHide, useDidShow } from '@binance/mp-service'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import { throttle } from 'lodash'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

const ToggleWrapperText = styled(Text)`
  margin-left: 8px;
`

const LabelWrapper = styled.div``

const LabelWrapperText = styled(Text)`
  font-size: 12px;
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`
const NUMBER_OF_FARMS_VISIBLE = 2000

export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const Farms: React.FC<{ farmsData: any; cakePrice: any }> = ({ children, farmsData, cakePrice }) => {
  // const { pathname } = useRouter()
  const { t } = useTranslation()
  const {
    state: { page },
  } = useFarmsWrapper()
  const { data: farmsLP, userDataLoaded, regularCakePerBlock } = farmsData
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  // const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  const isArchived = false
  const isInactive = page === FarmsPage.History
  const isActive = !isInactive && !isArchived

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              new BigNumber(farm.poolWeight),
              cakePrice,
              totalLiquidity,
              farm.lpAddresses[ChainId.MAINNET],
              regularCakePerBlock,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive, regularCakePerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  // useEffect(() => {
  //   if (isIntersecting) {
  // const setVisible = useCallback(
  //   throttle(
  //     () =>
  //       setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
  //         if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
  //           return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
  //         }
  //         return farmsCurrentlyVisible
  //       }),
  //     10000,
  //   ),
  //   [],
  // )
  //   }
  // }, [isIntersecting])

  const rowData = chosenFarmsMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')
    const row: RowProps = {
      apr: {
        value: getDisplayApr(farm.apr, farm.lpRewardsApr),
        pid: farm.pid,
        multiplier: farm.multiplier,
        lpLabel,
        lpSymbol: farm.lpSymbol,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apr,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema
      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }
              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))
      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }

    return <FlexLayout>{children}</FlexLayout>
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }
  const [remainHeight, setRemainHeight] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      bn.createSelectorQuery()
        .selectAll('.farms-control')
        .boundingClientRect(function (rect) {
          const { safeArea } = getSystemInfoSync()
          setRemainHeight(safeArea.height - rect[0].height - 16 - 8 - 39 - 44 - 49)
        })
        .exec()
    }, 0)
  }, [remainHeight])
  // if (execQuerySelector) {
  //   execQuerySelector = false
  // }
  return (
    <FarmsContext.Provider value={{ chosenFarmsMemoized, height: remainHeight, cakePrice }}>
      {/* <PageHeader> */}
      <Heading as="h1" scale="lg" color="secondary" style={{ fontSize: '24px', fontWeight: 'bold' }} mb="8px">
        {t('Farms')}
      </Heading>
      <Heading scale="lg" color="text" style={{ fontSize: '16px', fontWeight: 'bold' }} mb="4px">
        {t('Stake LP tokens to earn.')}
      </Heading>
      {/* </PageHeader> */}
      {/* <Page> */}
      <ControlContainer className="farms-control">
        <ViewControls>
          <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
          <ToggleWrapper>
            <Toggle
              id="staked-only-farms"
              checked={stakedOnly}
              onChange={() => setStakedOnly(!stakedOnly)}
              scale="sm"
            />
            <ToggleWrapperText> {t('Staked only')}</ToggleWrapperText>
          </ToggleWrapper>
          <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
        </ViewControls>
        <FilterContainer style={{ paddingBottom: 0 }}>
          <LabelWrapperText style={{ minWidth: '136px' }} textTransform="uppercase">
            {t('Sort by')}
          </LabelWrapperText>
          <LabelWrapperText style={{ width: '100%', marginLeft: '16px' }} textTransform="uppercase">
            {t('Search')}
          </LabelWrapperText>
        </FilterContainer>
        <FilterContainer style={{ paddingTop: 0 }}>
          <LabelWrapper>
            <Select
              options={[
                {
                  label: t('Hot'),
                  value: 'hot',
                },
                {
                  label: t('APR'),
                  value: 'apr',
                },
                {
                  label: t('Multiplier'),
                  value: 'multiplier',
                },
                {
                  label: t('Earned'),
                  value: 'earned',
                },
                {
                  label: t('Liquidity'),
                  value: 'liquidity',
                },
              ]}
              onOptionChange={handleSortOptionChange}
            />
          </LabelWrapper>
          {/* <LabelWrapper style={{ marginLeft: 16 }}> */}
          <SearchInput style={{ marginLeft: 16 }} onChange={handleChangeQuery} placeholder="Search Farms" />
          {/* </LabelWrapper> */}
        </FilterContainer>
      </ControlContainer>
      {renderContent()}
      {/* {account && !userDataLoaded && stakedOnly && ( */}
      {/*   <Flex justifyContent="center"> */}
      {/*     <Loading /> */}
      {/*   </Flex> */}
      {/* )} */}
      {/* <view ref={observerRef} /> */}
      {/* <StyledImage */}
      {/*   src="https://pancakeswap.finance/images/decorations/3dpan.png" */}
      {/*   alt="Pancake illustration" */}
      {/*   width={120} */}
      {/*   height={103} */}
      {/* /> */}
      {/* </Page> */}
    </FarmsContext.Provider>
  )
}

export const FarmsContext = React.createContext({ chosenFarmsMemoized: [] })

// let origin = null

const Fetcher = React.memo(({ setFarmsData, setCakePrice }) => {
  const { data, userDataLoaded, regularCakePerBlock } = useFarms()
  const cakePrice = usePriceCakeBusd()
  useEffect(() => {
    setFarmsData({ data, userDataLoaded, regularCakePerBlock })
  }, [data, userDataLoaded, setFarmsData, regularCakePerBlock])
  useEffect(() => {
    setCakePrice(cakePrice)
  }, [cakePrice, setCakePrice])
  usePollFarmsWithUserData(false)
  return null
})

const FramsWrapper = ({ children }) => {
  // const [isHide, setIsHide] = useState(false)
  const [farmsData, setFarmsData] = useState({ data: [] })
  const [cakePrice, setCakePrice] = useState(null)
  // useDidShow(() => {
  //   setIsHide(false)
  // })
  // useDidHide(() => {
  //   setIsHide(true)
  // })
  return (
    <view>
      <Farms farmsData={farmsData} cakePrice={cakePrice} children={children} />
      <Fetcher setFarmsData={setFarmsData} setCakePrice={setCakePrice} />
      {/* <Fetcher setFarmsData={setFarmsData} setCakePrice={setCakePrice} /> */}
    </view>
  )
}

export default FramsWrapper
