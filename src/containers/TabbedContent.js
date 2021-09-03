import React from 'react'
import { Tab } from 'semantic-ui-react'
import TokenBalanceInfo from '../components/TokenBalanceInfo.js'

import EtheriumTransactionsPane from '../components/EtheriumTransactionsPane'
import EtheriumTokenTransfersPane from '../components/EtheriumTokenTransfersPane'
import EtheriumBlocksPane from '../components/EtheriumBlocksPane'
import EtheriumLiquidityPoolsPane from '../components/EtheriumLiquidityPoolsPane'
import EtheriumMinedBlocksPane from '../components/EtheriumMinedBlocksPane'

import BinanceTransactionsPane from '../components/BinanceTransactionsPane'
import BinanceTokenTransfersPane from '../components/BinanceTokenTransfersPane'
import BinanceBlocksPane from '../components/BinanceBlocksPane'
import BinanceLiquidityPoolsPane from '../components/BinanceLiquidityPoolsPane'
import BinanceMinedBlocksPane from '../components/BinanceMinedBlocksPane'

import PolygonTransactionsPane from '../components/PolygonTransactionsPane'
import PolygonTokenTransfersPane from '../components/PolygonTokenTransfersPane'
import PolygonBlocksPane from '../components/PolygonBlocksPane'
import PolygonLiquidityPoolsPane from '../components/PolygonLiquidityPoolsPane'
import PolygonMinedBlocksPane from '../components/PolygonMinedBlocksPane'

const TabbedContent = ({ address }) => {
  console.log("After Processing",address);
  if (!address) return null
  const panes = [
    address.tokens
      ? {
        menuItem: 'Eth Token balances',
        render: () => (
          <Tab.Pane as='div'>
            {address.tokens.map((token, key) => (
              <TokenBalanceInfo key={key} token={token} />
              ))}
          </Tab.Pane>
          )
      }
      : null,
    address.etheriumTransactions
      ? {
        menuItem: 'Etherium Transactions',
        render: () => (
          <Tab.Pane  as='div'><EtheriumTransactionsPane address={address} /></Tab.Pane>
          )
      }
      : null,
    address.etheriumTokenTransfers
      ? {
        menuItem: 'Etherium Token transfers',
        render: () => (
          <Tab.Pane as='div'>
            <EtheriumTokenTransfersPane address={address} />
          </Tab.Pane>
        )
      }
      : null,
    address.etheriumBlocks
      ? {
        menuItem: 'Etherium Blockwise Traverse',
        render: () => (
          <Tab.Pane as='div'>
            <EtheriumBlocksPane address={address} />
          </Tab.Pane>
        )
      }
      : null,
    address.etheriumBlocks
      ? {
        menuItem: 'Etherium Liquidity Pools',
        render: () => (
          <Tab.Pane as='div'> <EtheriumLiquidityPoolsPane address={address} /> </Tab.Pane>
        )
      }
      : null,
    address.etheriumMinedBlocks
      ? {
        menuItem: 'Etherium Mined blocks',
        render: () => (
          <Tab.Pane as='div'><EtheriumMinedBlocksPane address={address} /></Tab.Pane>
          )
      }
      : null,
    address.binanceTransactions
      ? {
        menuItem: 'Binance Transactions',
        render: () => (
          <Tab.Pane as='div'><BinanceTransactionsPane address={address} /></Tab.Pane>
        )
      }
      : null,
    address.binanceTokenTransfers
      ? {
        menuItem: 'Binance Token transfers',
        render: () => (
          <Tab.Pane as='div'>
            <BinanceTokenTransfersPane address={address} />
          </Tab.Pane>
        )
      }
      : null,
    address.binanceBlocks
      ? {
        menuItem: 'Binance Blockwise Traverse',
        render: () => (
          <Tab.Pane as='div'> <BinanceBlocksPane address={address} /> </Tab.Pane>
        )
      }
      : null,
    address.binanceBlocks
      ? {
        menuItem: 'Binance Liquidity Pools',
        render: () => (
          <Tab.Pane as='div'> <BinanceLiquidityPoolsPane address={address} /> </Tab.Pane>
        )
      }
      : null,
    address.binanceMinedBlocks
      ? {
        menuItem: 'Binance Mined blocks',
        render: () => (
          <Tab.Pane as='div'><BinanceMinedBlocksPane address={address} /></Tab.Pane>
        )
      }
      : null,
    address.polygonTransactions
      ? {
        menuItem: 'Polygon Transactions',
        render: () => (
          <Tab.Pane as='div'><PolygonTransactionsPane address={address} /></Tab.Pane>
        )
      }
      : null,
    address.polygonTokenTransfers
      ? {
        menuItem: 'Polygon Token transfers',
        render: () => (
          <Tab.Pane as='div'>
            <PolygonTokenTransfersPane address={address} />
          </Tab.Pane>
        )
      }
      : null,
    address.polygonBlocks
      ? {
        menuItem: 'Polygon Blockwise Traverse',
        render: () => (
          <Tab.Pane as='div'> <PolygonBlocksPane address={address} /> </Tab.Pane>
        )
      }
      : null,
    address.polygonBlocks
      ? {
        menuItem: 'Polygon Liquidity Pools',
        render: () => (
          <Tab.Pane as='div'> <PolygonLiquidityPoolsPane address={address} /> </Tab.Pane>
        )
      }
      : null,
    address.polygonMinedBlocks
      ? {
        menuItem: 'Polygon Mined blocks',
        render: () => (
          <Tab.Pane as='div'><PolygonMinedBlocksPane address={address} /></Tab.Pane>
        )
      }
      : null
  ]
  return <Tab menu={{ borderless: true }, {style: {
    "overflowX": "scroll"
  }}} panes={panes} />
}

export default TabbedContent
