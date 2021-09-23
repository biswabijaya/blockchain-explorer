import etherscanApi from 'etherscan-api'
import axios from 'axios'
import { config } from '../config'

const api = etherscanApi.init(config.etherscanApiKey)

export function getTokenTransfers (address) {
  return api.account.tokentx(address, null, 1, 'latest', 'desc');
}

export function getTransactions (address) {
  return api.account.txlist(address, 1, 'latest', 'desc')
}

export function getInternalTransactions(txhash, address, startblock=1, endblock='latest', sort='asc') {
  return api.account.txlistinternal(txhash, address, startblock, endblock, sort)
}

export function getMinedBlocks (address) {
  return api.account.getminedblocks(address)
}

export function getEthSupply (resolve, reject) {
  api.stats.ethsupply()
    .then(result => resolve(result))
    .catch(error => reject(error))
}

export function getEthPrice (resolve, reject) {
  api.stats.ethprice()
    .then(result => resolve(result))
    .catch(error => reject(error))
}

export function getTokenInfo(contractAddress) {
  const API = 'http://api.etherscan.io/'
  return axios.get(`${API}/api?module=token&action=tokeninfo&contractaddress=${contractAddress}&apiKey=${config.etherscanApiKey}`, {
    params: {
      period: 30
    }
  })
}


export function getLiquidityPools(address) {

  let body = { query: `
                    {
                      liquidityPositionSnapshots(orderBy: timestamp,orderDirection: asc,where: {user: "${address}"} first: 1000) {
                      block,
                      timestamp,
                      pair {
                          id,
                          reserve0,
                          reserve1,
                          totalSupply,
                          token0 {
                            id,
                            symbol,
                            name,
                            decimals
                        }
                        token1 {
                            id,
                            symbol,
                            name,
                            decimals
                        }
                      },
                        liquidityTokenBalance,
                        liquidityTokenTotalSupply,
                        token0PriceUSD,
                        token1PriceUSD,
                        reserve0,
                        reserve1,
                        reserveUSD
                      }
                    }
                `,
    variables: {}
  }

  var liquidityPoolsByBlock = {};

  let options = {};
  axios.post('https://api.thegraph.com/subgraphs/name/sushiswap/exchange', body, options)
  .then((response) => {
    response.data.data.liquidityPositionSnapshots.forEach((transaction) => {
      if (liquidityPoolsByBlock[transaction.block] == undefined) {
        liquidityPoolsByBlock[transaction.block] = {
          name: transaction.pair.token0.symbol + "" + transaction.pair.token1.symbol,
          poolname: "sushiswap",
          address: transaction.pair.id,
          priceRatio: +(+transaction.token0PriceUSD / +transaction.token1PriceUSD).toFixed(4),
          priceUSD: {
            [transaction.pair.token0.symbol]: +transaction.token0PriceUSD,
            [transaction.pair.token1.symbol]: +transaction.token1PriceUSD,
            lptoken: +(+transaction.reserveUSD / +transaction.liquidityTokenTotalSupply).toFixed(8)
          },
          reserveTotal: {
            [transaction.pair.token0.symbol]: transaction.pair.reserve0,
            [transaction.pair.token1.symbol]: transaction.pair.reserve1
          },
          reserveAvailable: {
            [transaction.pair.token0.symbol]: transaction.reserve0,
            [transaction.pair.token1.symbol]: transaction.reserve1
          },
          reserveChange: {
            [transaction.pair.token0.symbol]: (+transaction.pair.reserve0) - (+transaction.reserve0),
            [transaction.pair.token1.symbol]: (+transaction.pair.reserve1) - (+transaction.reserve1)
          },
          reserveUSD: +(+transaction.reserveUSD).toFixed(4),
          balanceLPToken: +transaction.liquidityTokenBalance,
          supplyLPToken: +transaction.liquidityTokenTotalSupply,
          pair: transaction.pair,

        };
      }
    });

    axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', body, options)
      .then((response) => {
        // console.log('fdfdfdfdfdfdffdfdfdfdfdfdfdf', response.data.data.liquidityPositionSnapshots);

        response.data.data.liquidityPositionSnapshots.forEach((transaction) => {
          if (liquidityPoolsByBlock[transaction.block] == undefined) {
            liquidityPoolsByBlock[transaction.block] = {
              name: transaction.pair.token0.symbol + "" + transaction.pair.token1.symbol,
              poolname:"uniswap",
              address: transaction.pair.id,
              priceRatio: +(+transaction.token0PriceUSD / +transaction.token1PriceUSD).toFixed(4),
              priceUSD: {
                [transaction.pair.token0.symbol]: +transaction.token0PriceUSD,
                [transaction.pair.token1.symbol]: +transaction.token1PriceUSD,
                lptoken: +(+transaction.reserveUSD / +transaction.liquidityTokenTotalSupply).toFixed(8)
              },
              reserveTotal: {
                [transaction.pair.token0.symbol]: transaction.pair.reserve0,
                [transaction.pair.token1.symbol]: transaction.pair.reserve1
              },
              reserveAvailable: {
                [transaction.pair.token0.symbol]: transaction.reserve0,
                [transaction.pair.token1.symbol]: transaction.reserve1
              },
              reserveChange: {
                [transaction.pair.token0.symbol]: (+transaction.pair.reserve0) - (+transaction.reserve0),
                [transaction.pair.token1.symbol]: (+transaction.pair.reserve1) - (+transaction.reserve1)
              },
              reserveUSD: +(+transaction.reserveUSD).toFixed(4),
              balanceLPToken: +transaction.liquidityTokenBalance,
              supplyLPToken: +transaction.liquidityTokenTotalSupply,
              pair: transaction.pair,

            };
          }
        });
      });
  });
    

  

  

  return liquidityPoolsByBlock;
}