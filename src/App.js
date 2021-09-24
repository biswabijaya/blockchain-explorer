import React, { Component } from 'react'
import moment from 'moment'
import './App.css'
import TransactionStatus from './components/TransactionStatus'
import InfoRow from './components/InfoRow'
import * as api from './api/web3Wrapper'
import * as ethplorer from './api/ethplorer'
import * as etherscan from './api/etherscan'
import * as bscscan from './api/bscscan'
import * as polygonscan from './api/polygonscan'
import {
  Button,
  Grid,
  Message,
  Segment,
  Input,
  Header
} from 'semantic-ui-react'
import AddressInfo from './components/AddressInfo'
import ContractInfo from './components/ContractInfo'
import TabbedContent from './containers/TabbedContent'
import { objectExpression } from '@babel/types'

const MAX_COUNT = 200;
var etheriumLiquidityPoolsByBlock = {};
var binanceLiquidityPoolsByBlock={};
var polygonLiquidityPoolsByBlock = {};

var addr = '', uniqueTokens = {}, uniqueAddress = {};
var liquidityPools ={
  ethereum: { },
  binance: { },
  polygon: { }
};
var gasFees = {
  ethereum: 0,
  binance: 0,
  polygon: 0
};
var investments = {
  ethereum: [],
  binance: [],
  polygon: []
};
var myAddress = '';

uniqueAddress['0x618ffd1cdabee36ce5992a857cc7463f21272bd7'.toLowerCase()] = {
  'address':'0x618ffd1cdabee36ce5992a857cc7463f21272bd7'.toLowerCase(),
  'name': 'WazirX',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0x8894e0a0c962cb723c1976a4421c95949be2d4e3'.toLowerCase()] = {
  'address': '0x8894e0a0c962cb723c1976a4421c95949be2d4e3'.toLowerCase(),
  'name': 'Binance',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0xe2fc31f816a9b94326492132018c3aecc4a93ae1'.toLowerCase()] = {
  'address': '0xe2fc31f816a9b94326492132018c3aecc4a93ae1'.toLowerCase(),
  'name': 'Binance',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0xdccf3b77da55107280bd850ea519df3705d1a75a'.toLowerCase()] = {
  'address': '0xdccf3b77da55107280bd850ea519df3705d1a75a'.toLowerCase(),
  'name': 'Binance',
  'type': 'Exchange',
  'tags': ['Exchange']
};


uniqueAddress['0x9696f59E4d72E237BE84fFD425DCaD154Bf96976'.toLowerCase()] = {
  'address':'0x9696f59E4d72E237BE84fFD425DCaD154Bf96976'.toLowerCase(),
  'name': 'Binance',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'.toLowerCase()] = {
  'address': '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'.toLowerCase(),
  'name': 'SushiSwap',
  'type': 'Application',
  'tags': []
};

uniqueAddress['0x8B00eE8606CC70c2dce68dea0CEfe632CCA0fB7b'.toLowerCase()] = {
  'address': '0x8B00eE8606CC70c2dce68dea0CEfe632CCA0fB7b'.toLowerCase(),
  'name': 'SushiSwap',
  'type': 'Application',
  'tags': []
};

uniqueAddress['0xc2edad668740f1aa35e4d8f227fb8e17dca888cd'.toLowerCase()] = {
  'address':'0xc2edad668740f1aa35e4d8f227fb8e17dca888cd'.toLowerCase(),
  'name': 'SushiSwap: MasterChef LP Staking Pool',
  'type': 'Application',
  'tags': ['Staking', 'Yield Farming']
};

uniqueAddress['0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'.toLowerCase()] = {
  'address':'0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'.toLowerCase(),
  'name': 'SushiSwap: Router',
  'type': 'Application',
  'tags': ['Liquidity']
};

uniqueAddress['0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'.toLowerCase()] = {
  'address':'0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'.toLowerCase(),
  'name': 'SushiSwap: SUSHI',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f'.toLowerCase()] = {
  'address':'0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f'.toLowerCase(),
  'name': 'SushiSwap: DAI',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0x881D40237659C251811CEC9c364ef91dC08D300C'.toLowerCase()] = {
  'address': '0x881D40237659C251811CEC9c364ef91dC08D300C'.toLowerCase(),
  'name': 'Metamask: Swap Router',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase()] = {
  'address': '0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase(),
  'name': 'PancakeSwap: Router v2',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0x74de5d4fcbf63e00296fd95d33236b9794016631'.toLowerCase()] = {
  'address':'0x74de5d4fcbf63e00296fd95d33236b9794016631'.toLowerCase(),
  'name': 'Metamask: Approve',
  'type': 'Application',
  'tags': ['Approval']
};

uniqueAddress['0x0000000000000000000000000000000000000000'.toLowerCase()] = {
  'address': '0x0000000000000000000000000000000000000000'.toLowerCase(),
  'name': 'Minted Token',
  'type': 'Blockchain',
  'tags': ['Mining']
};

if (localStorage.getItem('addr')) {
  addr = localStorage.getItem('addr');
  // console.log(addr);
} else {
  localStorage.setItem('addr', addr);
}

class App extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      searchValue: addr, //0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b
      error: null,
      transaction: null,
      receipt: null,
      block: null,
      address: null
    }

    this.state = {
      ...this.initialState,
      searchFinished: false,
      currentBlock: 0,
      blocks: {},
      ethSupply: 0,
      ethPrice: {}
    }
  }

  componentDidMount () {
    this.timerID = setInterval(this.getCurrentBlock, 10000000)
    etherscan.getEthSupply(this.handleEthSupply, this.onError)
    etherscan.getEthPrice(this.handleEthPrice, this.onError)
  }

  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  onError = error => {
    this.setState({
      error: error.message
    })
  }

  getCurrentBlock = () => {
    api.getBlockNumber(currentBlock => this.setState({ currentBlock }))
  }

  reset = () => {
    this.setState({
      ...this.initialState,
      searchFinished: false
    })
  }

  handleEthSupply = result => {
    if (result.status === '1') {
      this.setState({
        ethSupply: result.result
      })
    }
  }

  handleEthPrice = result => {
    if (result.status === '1') {
      this.setState({
        ethPrice: result.result
      })
    }
  }

  handleTransactionInfo = (error, info) => {
    this.setState({ searchFinished: true })
    if (error) this.onError(error)
    if (info) {
      console.log('info', info)
      this.setState({ ...info })
    }
  }

  handleBlockInfo = (error, block) => {
    this.setState({ searchFinished: true })
    if (error) this.onError(error)
    if (block) {
      this.setState({ block })
    }
  }

  handleAddressInfo = address => {
    address.etheriumLiquidityPoolsByBlock = etherscan.getLiquidityPools(address.address);
    address.binanceLiquidityPoolsByBlock = "";
    address.polygonLiquidityPoolsByBlock = "";

    etheriumLiquidityPoolsByBlock = address.etheriumLiquidityPoolsByBlock;
    binanceLiquidityPoolsByBlock = address.binanceLiquidityPoolsByBlock;
    polygonLiquidityPoolsByBlock = address.polygonLiquidityPoolsByBlock;

    console.log("dddddd", address);

    uniqueAddress[address.address.toLowerCase()] = {
      'address': address.address.toLowerCase(),
      'name': 'My Wallet',
      'type': 'Wallet',
      'tags': ['Wallet']
    }
    this.setState({ address })
    // console.log(address);

    myAddress = address.address;

    //index tokens
    address.tokensIndexed = { };
    address.tokens.map((token) => {
      address.tokensIndexed[token.tokenInfo.address] = token;
    })

    setTimeout(()=>{
      console.log("called");
      //etherscan
      etherscan.getTokenTransfers(address.address).then(result => {
        this.handleEtheriumTokenTransfers(result)
        etherscan.getTransactions(address.address).then(result => {
          this.handleEtheriumAddressTransactions(result)
          etherscan
            .getMinedBlocks(address.address)
            .then(result => this.handleEtheriumMinedBlocks(result))
            .catch(this.onError)
        })
      });
      //bscscan
      bscscan.getTokenTransfers(address.address).then(result => {
        this.handleBinanceTokenTransfers(result)
        bscscan.getTransactions(address.address).then(result => {
          this.handleBinanceAddressTransactions(result)
          bscscan
            .getMinedBlocks(address.address)
            .then(result => this.handleBinanceMinedBlocks(result))
            .catch(this.onError)
        })
      });
      //polygonscan
      polygonscan.getTokenTransfers(address.address).then(result => {
        this.handlePolygonTokenTransfers(result)
        polygonscan.getTransactions(address.address).then(result => {
          this.handlePolygonAddressTransactions(result)
          polygonscan
            .getMinedBlocks(address.address)
            .then(result => this.handlePolygonMinedBlocks(result))
            .catch(this.onError)
        })
      });
    },1000)
    
    
  }

  handleLabelling = (blocks,chain) => {
    // console.log("handleLabelling called", blocks);
    var tr_in = 0;
    var tr_out = 0;
    var tr_approve = 0;

    Object.keys(blocks).map((blockNumber) => {
      switch (blocks[blockNumber]['type']) {
        case 'Wallet Credit':
          blocks[blockNumber]['platform'] = { ...uniqueAddress[blocks[blockNumber].transactions[0].from.toLowerCase()] } || { name: "Unknown Platform 1", address: blocks[blockNumber].transactions[0].from.toLowerCase() };
          //invest

          break;
        case 'Wallet Debit':
          blocks[blockNumber]['platform'] = { ...uniqueAddress[blocks[blockNumber].transactions[0].to.toLowerCase()] } || { name: "Unknown Platform 2", address: blocks[blockNumber].transactions[0].to.toLowerCase() };
          break;

        default:
          if (blocks[blockNumber].transactions[0].contractAddress.toLowerCase() == "") {
            blocks[blockNumber]['platform'] = { ...uniqueAddress[blocks[blockNumber].transactions[0].contractAddress.toLowerCase()] };
          } else {
            if (blocks[blockNumber].transactions[0].from.toLowerCase() != myAddress.toLowerCase()) {
              blocks[blockNumber]['platform'] = { name: (uniqueAddress[blocks[blockNumber].transactions[0].from.toLowerCase()] != undefined) ? uniqueAddress[blocks[blockNumber].transactions[0].from.toLowerCase()].name : "Some Exchange", address: blocks[blockNumber].transactions[0].from.toLowerCase() };
              //invest

            } else {
              blocks[blockNumber]['platform'] = { name: "My Wallet", address: "" };
            }
          }
          break;
      }

      tr_in = blocks[blockNumber].in.length;
      tr_out = blocks[blockNumber].out.length;
      tr_approve = blocks[blockNumber].approve.length;

      let p_name = blocks[blockNumber]['platform'].name;

      if ((tr_in == 1) && (tr_out == 0) && (tr_approve == 0)) {
        blocks[blockNumber]['platform'].tname = "Add from " + p_name;
      } else if ((tr_in == 0) && (tr_out == 1) && (tr_approve == 0)) {
        blocks[blockNumber]['platform'].tname = "Withdraw from " + p_name;
      } else if ((tr_in == 1) && (tr_out == 1) && (tr_approve == 0)) {
        blocks[blockNumber]['platform'].tname = "Swap " + blocks[blockNumber]['out'][0].tokenSymbol + " with " + blocks[blockNumber]['in'][0].tokenSymbol;

      } else if ((tr_in == 1) && (tr_out == 1) && (tr_approve == 1)) {
        if (blocks[blockNumber]['approve'][0].address == blocks[blockNumber]['in'][0].address) {
          //if pool token is defined
          if (liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress] != undefined) {
            blocks[blockNumber]['platform'].tname = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"] + " LP - Remove";
            blocks[blockNumber].blockLabel = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"];
          } else if (liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress] != undefined) {
            //get reward in first transaction
            liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] || 0;
            liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] = parseInt(blocks[blockNumber]['transactions'][0].value);

            blocks[blockNumber]['platform'].tname = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["pool"] + " LP - Stake Again";
            blocks[blockNumber].blockLabel = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["pool"];
          }
        } else {
          blocks[blockNumber]['platform'].tname = "Swap " + blocks[blockNumber]['out'][0].tokenSymbol + " with " + blocks[blockNumber]['in'][0].tokenSymbol;
        }

      } else if ((tr_in == 1) && (tr_out == 2) && (tr_approve >= 0)) {

        //sort the pool assets in asc name
        blocks[blockNumber]['out'].sort(function (a, b) {
          if (a.tokenSymbol < b.tokenSymbol) { return -1; }
          if (a.tokenSymbol > b.tokenSymbol) { return 1; }
          return 0;
        })
        
        //if pool token is defined
        if (uniqueTokens[blocks[blockNumber]['out'][0].address] != undefined) {
          blocks[blockNumber]['platform'].tname = blocks[blockNumber]['out'][0].tokenSymbol + "/" + blocks[blockNumber]['out'][1].tokenSymbol + " LP - Add";
          blocks[blockNumber].blockLabel = blocks[blockNumber]['out'][0].tokenSymbol + blocks[blockNumber]['out'][1].tokenSymbol;
          blocks[blockNumber].blockLabelToken = uniqueTokens[blocks[blockNumber]['out'][0].address]
          uniqueTokens[blocks[blockNumber]['out'][0].address]["pool"] = blocks[blockNumber].blockLabel;
          liquidityPools[chain][blocks[blockNumber]['out'][0].address] = uniqueTokens[blocks[blockNumber]['out'][0].address];
          console.log();
        }
      } else if ((tr_in == 2) && (tr_out == 1) && (tr_approve >= 1)) {

        //sort the pool assets in asc name
        blocks[blockNumber]['in'].sort(function (a, b) {
          if (a.tokenSymbol < b.tokenSymbol) { return -1; }
          if (a.tokenSymbol > b.tokenSymbol) { return 1; }
          return 0;
        })
        
        //if pool token is defined
        if (liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress] != undefined) {
          blocks[blockNumber]['platform'].tname = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"] + " LP - Remove";
          blocks[blockNumber].blockLabel = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"];
        }
        
      } else if ((tr_in == 0) && (tr_out == 1) && (tr_approve >= 1)) {
        blocks[blockNumber]['platform'].tname = "Stake Transaction";
        if (liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress] != undefined) {
          blocks[blockNumber]['platform'].tname = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"] +" LP - Stake";
          blocks[blockNumber].blockLabel = liquidityPools[chain][blocks[blockNumber]['transactions'][0].contractAddress]["pool"];
        }
      } else if ((tr_in == 2) && (tr_out == 0) && (tr_approve >= 1)) {
        blocks[blockNumber]['platform'].tname = "Un-Stake Transaction";
        if (liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress] != undefined) {
          //get reward in first transaction
          liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] || 0;
          liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["reward"] += parseInt(blocks[blockNumber]['transactions'][0].value);

          blocks[blockNumber]['platform'].tname = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["pool"] + " LP - Unstake";
          blocks[blockNumber].blockLabel = liquidityPools[chain][blocks[blockNumber]['transactions'][1].contractAddress]["pool"];
        }
        // console.log(blockNumber, blocks[blockNumber]);

      } else {
        blocks[blockNumber]['platform'].tname = "Approval Transaction";
        if (uniqueAddress[blocks[blockNumber].transactions[0].to]!=undefined) {
          blocks[blockNumber]['platform'].name = uniqueAddress[blocks[blockNumber].transactions[0].to].name;
        } else {
          blocks[blockNumber]['platform'].name = "Decentralised Wallet";
        }
      }

      if (blocks[blockNumber].platform.tname != undefined && blocks[blockNumber].platform.tname.includes("Add from")) {
        investments[chain][moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD")] = blocks[blockNumber].in;
      }
      gasFees[chain] += parseFloat(blocks[blockNumber].gasFee);

    });

    // console.log("liquidityPools", liquidityPools);
    // console.log("investments", chain, investments[chain]);
    // console.log("gasFees", chain, gasFees[chain]);

    return blocks;
  }

  handleLiquidityPools = (blocks, liquidityPoolsByBlock, chain) => {

    var address = this.state.address;
    
    let liquidity_pool = {};
    let pool_name = "", token_symbol = "";
    let liquidity_pool_assets = { };
    let liquidity_pool_gasfees = {};
    let liquidity_pool_rewards = {};


    let newratio = 1, oldratio = 1, priceratio=1, il=0;

    Object.keys(liquidityPoolsByBlock).map((blockNumber) => {

      // console.log("--------Block Called", blockNumber);

      //get a block
      if (blocks[blockNumber]['blockLabel'] != undefined) {
        
        pool_name = blocks[blockNumber]['blockLabel'];

        // console.log("--------pool_name Called ", pool_name);

        if (liquidity_pool[pool_name] == undefined) {
          liquidity_pool[pool_name] = [];

          liquidity_pool_assets[pool_name] = {};
          liquidity_pool_gasfees[pool_name] = 0;
          liquidity_pool_rewards[pool_name] = {};
          

          token_symbol = blocks[blockNumber].out[0].tokenSymbol;
          liquidity_pool_assets[pool_name][token_symbol] = {
            tokenValue: 0,
            tokenPrice: +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol],
            added: 0,
            withdrawn: 0,
            invested: 0,
            current: 0
          }
          // console.log("--------PoolToken---Init1----" + token_symbol, 0, blockNumber, { ...liquidity_pool_assets[pool_name][token_symbol] });

          token_symbol = blocks[blockNumber].out[1].tokenSymbol;
          liquidity_pool_assets[pool_name][token_symbol] = {
            tokenValue: 0,
            tokenPrice: +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol],
            added: 0,
            withdrawn: 0,
            invested: 0,
            current: 0
          }
          // console.log("--------PoolToken---Init2----" + token_symbol, 1, blockNumber, { ...liquidity_pool_assets[pool_name][token_symbol] });


        } else {
          token_symbol = Object.keys(liquidity_pool_assets[pool_name])[0];

          //init quantity and update price
          liquidity_pool_assets[pool_name][token_symbol].tokenValue += 0;
          liquidity_pool_assets[pool_name][token_symbol].tokenPrice = +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol];

          //initialise added, withdrawn
          liquidity_pool_assets[pool_name][token_symbol]["added"] = 0;
          liquidity_pool_assets[pool_name][token_symbol]["withdrawn"] = 0;

          //update invested amount (after addition) and current amount
          liquidity_pool_assets[pool_name][token_symbol]["invested"] += 0;
          liquidity_pool_assets[pool_name][token_symbol]["current"] += 0;

          token_symbol = Object.keys(liquidity_pool_assets[pool_name])[1];

          //init quantity and update price
          liquidity_pool_assets[pool_name][token_symbol].tokenValue += 0;
          liquidity_pool_assets[pool_name][token_symbol].tokenPrice = +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol];

          //initialise added, withdrawn
          liquidity_pool_assets[pool_name][token_symbol]["added"] = 0;
          liquidity_pool_assets[pool_name][token_symbol]["withdrawn"] = 0;

          //update invested amount (after addition) and current amount
          liquidity_pool_assets[pool_name][token_symbol]["invested"] += 0;
          liquidity_pool_assets[pool_name][token_symbol]["current"] += 0;

        }

        liquidity_pool_gasfees[pool_name] += parseFloat(blocks[blockNumber].gasFee);

        if (blocks[blockNumber]["platform"].tname.indexOf("Add") !== -1) {

          let objectPrint = {};
          let objectPrintHolding ={};
          let objectPrintLPHolding = {};

          if (liquidity_pool[pool_name].length==0) {
            let holdingPer = liquidityPoolsByBlock[blockNumber]?.balanceLPToken / liquidityPoolsByBlock[blockNumber]?.supplyLPToken *100;
            objectPrintHolding = {
              holding: holdingPer,
              chain:chain,
              poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
              gasFee: parseFloat(blocks[blockNumber].gasFee),
              gasFeeCumu:liquidity_pool_gasfees[pool_name],
              invested: 0,
              withdrawn: 0,
              reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
              holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
              holdingLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
              balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
              supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
              valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
            };
          } else {
            let temp_details = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].details;

            let newHolding = temp_details.holdingLPToken + liquidityPoolsByBlock[blockNumber]?.balanceLPToken;
            let holdingPer = newHolding / liquidityPoolsByBlock[blockNumber]?.supplyLPToken * 100;

            objectPrintHolding = {
              holding: holdingPer,
              chain:chain,
              poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
              gasFee: parseFloat(blocks[blockNumber].gasFee),
              gasFeeCumu:liquidity_pool_gasfees[pool_name],
              invested: temp_details.invested,
              withdrawn: temp_details.withdrawn,
              reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
              holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
              holdingLPToken: newHolding,
              balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
              supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
              valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
            };
          }
          

          //token1
          let token_symbol_0 = blocks[blockNumber].out[0].tokenSymbol;
              //add quantity
              liquidity_pool_assets[pool_name][token_symbol_0].tokenValue += (+blocks[blockNumber].out[0].tokenValue / Math.pow(10, blocks[blockNumber].out[0].tokenDecimal || 18));

              //find how much added and how much is current total
              let token0_added = +(+blocks[blockNumber].out[0].tokenValue / Math.pow(10, blocks[blockNumber].out[0].tokenDecimal || 18)
                * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0]).toFixed(4);
              let token0_withdrawn=0;
              let token0_current = +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue
                * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0]).toFixed(4);

              //initialise added, withdrawn
              liquidity_pool_assets[pool_name][token_symbol_0]["added"] = token0_added;
              liquidity_pool_assets[pool_name][token_symbol_0]["withdrawn"] = 0;

              //update invested amount (after addition) and current amount
              liquidity_pool_assets[pool_name][token_symbol_0]["invested"] += token0_added;
              liquidity_pool_assets[pool_name][token_symbol_0]["current"] = token0_current;

              let token0_invested = liquidity_pool_assets[pool_name][token_symbol_0]["invested"];

              objectPrint[token_symbol_0] = {
                addedUSD: token0_added,
                withdrawnUSD: token0_withdrawn,
                currentUSD: token0_current,
                investedUSD: token0_invested,
                tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
                tokenValue: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
                tokenDifference: 0,
                tokenInvested: liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
                tokenWithdrawn: 0
              }

              console.log("----@@@@@@---T0----Add"+pool_name, objectPrint);
          
          //token2
          let token_symbol_1 = blocks[blockNumber].out[1].tokenSymbol;
              //add quantity
              liquidity_pool_assets[pool_name][token_symbol_1].tokenValue += (+blocks[blockNumber].out[1].tokenValue / Math.pow(10, blocks[blockNumber].out[1].tokenDecimal || 18));

              //find how much added and how much is current total
              let token1_added = +(+blocks[blockNumber].out[1].tokenValue / Math.pow(10, blocks[blockNumber].out[1].tokenDecimal || 18)
                * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1]).toFixed(4);
              let token1_withdrawn=0;
              let token1_current = +(+liquidity_pool_assets[pool_name][token_symbol_1].tokenValue
                * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1]).toFixed(4);

              //initialise added, withdrawn
              liquidity_pool_assets[pool_name][token_symbol_1]["added"] = token1_added;
              liquidity_pool_assets[pool_name][token_symbol_1]["withdrawn"] = 0;

              //update invested amount (after addition) and current amount
              liquidity_pool_assets[pool_name][token_symbol_1]["invested"] += token1_added;
              liquidity_pool_assets[pool_name][token_symbol_1]["current"] = token1_current;

              let token1_invested = liquidity_pool_assets[pool_name][token_symbol_1]["invested"];

              objectPrint[token_symbol_1] = {
                addedUSD: token1_added,
                withdrawnUSD: token1_withdrawn,
                currentUSD: token1_current,
                investedUSD: token1_invested,
                tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
                tokenValue: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
                tokenDifference: 0,
                tokenInvested: liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
                tokenWithdrawn: 0
              }
              
          objectPrintHolding.invested = token1_invested + token0_invested;

          objectPrintLPHolding = {
            [token_symbol_0]: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
            [token_symbol_1]: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
            [token_symbol_0 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
            [token_symbol_1 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
            k: +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue),
            r: +liquidityPoolsByBlock[blockNumber]?.priceRatio
          };

          if (token_symbol_0 == liquidityPoolsByBlock[blockNumber].pair.token0.symbol) {
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          } else {
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          }
          
          objectPrintLPHolding[token_symbol_0 + "tUSD"] = objectPrintLPHolding[token_symbol_0 + "t"]* liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0];
          objectPrintLPHolding[token_symbol_1 + "tUSD"] = objectPrintLPHolding[token_symbol_1 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1];

          objectPrintLPHolding.totalUSD = objectPrintLPHolding[token_symbol_0 + "USD"] + objectPrintLPHolding[token_symbol_1 + "USD"];
          objectPrintLPHolding.totaltUSD = objectPrintLPHolding[token_symbol_0 + "tUSD"] + objectPrintLPHolding[token_symbol_1 + "tUSD"];

          objectPrintLPHolding.ilUSD = objectPrintLPHolding.totalUSD - objectPrintLPHolding.totaltUSD;
          objectPrintLPHolding.ilPer = objectPrintLPHolding.ilUSD / objectPrintLPHolding.totaltUSD * 100;
          
          liquidity_pool[pool_name].push({
            block: blockNumber,
            assets: objectPrint,
            details: objectPrintHolding,
            il: objectPrintLPHolding,
            date: moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD"),
            type: "Add",
            value: blocks[blockNumber].out[0].tokenValue,
            tokensIn: blocks[blockNumber].in,
            tokensOut: blocks[blockNumber].out,
            tokenPrices: liquidityPoolsByBlock[blockNumber]?.priceUSD,
            reward: liquidity_pool_rewards[pool_name]
          });

          

        } else if (blocks[blockNumber]["platform"].tname.indexOf("Remove") !== -1) {

          let objectPrint = {};
          let objectPrintLPHolding = {};

          let temp_details = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].details;

          let newHolding = temp_details.holdingLPToken - liquidityPoolsByBlock[blockNumber]?.balanceLPToken;
          if (liquidityPoolsByBlock[blockNumber]?.balanceLPToken==0) {
            newHolding=0;
          }
          let holdingPer = newHolding / liquidityPoolsByBlock[blockNumber]?.supplyLPToken * 100;

          let objectPrintHolding = {
            chain:chain,
            holding: holdingPer,
            poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
            gasFee: parseFloat(blocks[blockNumber].gasFee),
            gasFeeCumu:liquidity_pool_gasfees[pool_name],
            invested: temp_details.invested,
            withdrawn: temp_details.withdrawn,
            reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
            holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
            holdingLPToken: newHolding,
            balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
            supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
            valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
          };

          //token 2
          if (blocks[blockNumber].in[1] == undefined) {
            console.log("------Undefined pair", blockNumber, liquidity_pool_assets[pool_name], blocks[blockNumber], blocks[blockNumber].in[0].tokenSymbol);

            let price = liquidityPoolsByBlock[blockNumber].priceUSD["WETH"];
            let priceinvested = temp_details.invested/2;

            //handle issue
            blocks[blockNumber].in[1] = {
              "address": "0xa10d2e55f0f87756d6f99960176120c512eb3e15",
              "tokenSymbol": "WETH",
              "tokenName": "Wrapped Eth Token",
              "tokenDecimal": "18",
              "tokenValue": "" + parseInt(priceinvested / price * Math.pow(10,18))
            }
          }

          

          //token 1
          let token_symbol_0 = blocks[blockNumber].in[0].tokenSymbol;
          let token_symbol_1 = blocks[blockNumber].in[1].tokenSymbol;
          let token0_withdrawn = 0;
          let token1_withdrawn = 0;
          let token0_current = 0;
          let token1_current = 0;

          let token0_added = 0;
          let token1_added = 0;

          let token0_difference_value = (blocks[blockNumber].in[0].tokenValue / Math.pow(10, blocks[blockNumber].in[0].tokenDecimal)) - liquidity_pool_assets[pool_name][token_symbol_0].tokenValue;
          let token1_difference_value = (blocks[blockNumber].in[1].tokenValue / Math.pow(10, blocks[blockNumber].in[1].tokenDecimal)) - liquidity_pool_assets[pool_name][token_symbol_1].tokenValue;

          let token0_invested_value = liquidity_pool_assets[pool_name][token_symbol_0].tokenValue;
          let token1_invested_value = liquidity_pool_assets[pool_name][token_symbol_1].tokenValue;

          let token0_withdrawn_value = (blocks[blockNumber].in[0].tokenValue) / Math.pow(10, blocks[blockNumber].in[0].tokenDecimal);
          let token1_withdrawn_value = (blocks[blockNumber].in[1].tokenValue) / Math.pow(10, blocks[blockNumber].in[1].tokenDecimal);

          if (objectPrintHolding.holding == 0) {
            liquidity_pool_assets[pool_name][token_symbol_0].tokenValue = +blocks[blockNumber].in[0].tokenValue / Math.pow(10, blocks[blockNumber].in[0].tokenDecimal || 18);
            liquidity_pool_assets[pool_name][token_symbol_1].tokenValue = +blocks[blockNumber].in[1].tokenValue / Math.pow(10, blocks[blockNumber].in[1].tokenDecimal || 18);
            token0_withdrawn = token0_withdrawn_value * liquidityPoolsByBlock[blockNumber].priceUSD[token_symbol_0];
            token1_withdrawn = token1_withdrawn_value * liquidityPoolsByBlock[blockNumber].priceUSD[token_symbol_1];
            token0_current = 0;
            token1_current = 0;

            objectPrintHolding.withdrawn = token0_withdrawn + token1_withdrawn;
          } else {
            liquidity_pool_assets[pool_name][token_symbol_0].tokenValue -= (+blocks[blockNumber].in[0].tokenValue / Math.pow(10, blocks[blockNumber].in[0].tokenDecimal || 18));
            liquidity_pool_assets[pool_name][token_symbol_1].tokenValue -= ((+blocks[blockNumber]?.in[1].tokenValue || 0) / Math.pow(10, blocks[blockNumber].in[1].tokenDecimal || 18));
            token0_withdrawn = +(+blocks[blockNumber].in[0].tokenValue / Math.pow(10, blocks[blockNumber].in[0].tokenDecimal || 18)
              * +liquidity_pool_assets[pool_name][token_symbol_0]["invested"] / +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue).toFixed(4);
            token1_withdrawn = +(+blocks[blockNumber].in[1].tokenValue / Math.pow(10, blocks[blockNumber].in[1].tokenDecimal || 18)
              * +liquidity_pool_assets[pool_name][token_symbol_1]["invested"] / +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue).toFixed(4);
            liquidity_pool_assets[pool_name][token_symbol_0]["invested"] -= token0_withdrawn;
            liquidity_pool_assets[pool_name][token_symbol_1]["invested"] -= token1_withdrawn;

            token0_current = +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue
              * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0]).toFixed(4);
            token1_current = +(+liquidity_pool_assets[pool_name][token_symbol_1].tokenValue
              * +liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1]).toFixed(4);
          }

              //initialise added, withdrawn
              liquidity_pool_assets[pool_name][token_symbol_0]["added"] = 0;
              liquidity_pool_assets[pool_name][token_symbol_0]["withdrawn"] = token0_withdrawn;

              //update invested amount (after deduction) and current amount
              liquidity_pool_assets[pool_name][token_symbol_0]["current"] = token0_current;

              let token0_invested = liquidity_pool_assets[pool_name][token_symbol_0]["invested"];

              objectPrint[token_symbol_0] = {
                addedUSD: token0_added,
                withdrawnUSD: token0_withdrawn,
                currentUSD: token0_current,
                investedUSD: token0_invested,
                tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
                tokenValue: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
                tokenDifference: token0_difference_value,
                tokenInvested: token0_invested_value,
                tokenWithdrawn: token0_withdrawn_value
              }


              //initialise added, withdrawn
              liquidity_pool_assets[pool_name][token_symbol_1]["added"] = 0;
              liquidity_pool_assets[pool_name][token_symbol_1]["withdrawn"] = token1_withdrawn;

              //update invested amount (after deduction) and current amount
              liquidity_pool_assets[pool_name][token_symbol_1]["current"] = token1_current;

              let token1_invested=liquidity_pool_assets[pool_name][token_symbol_1]["invested"]

              objectPrint[token_symbol_1] = {
                addedUSD: token1_added,
                withdrawnUSD: token1_withdrawn,
                currentUSD: token1_current,
                investedUSD: token1_invested,
                tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
                tokenValue: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
                tokenDifference: token1_difference_value,
                tokenInvested: token1_invested_value,
                tokenWithdrawn: token1_withdrawn_value
              }


          objectPrintHolding.invested = token1_invested + token0_invested;

          objectPrintLPHolding = {
            [token_symbol_0]: +token0_invested_value,
            [token_symbol_1]: +token1_invested_value,
            [token_symbol_0 + 'USD']: +token0_invested_value * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
            [token_symbol_1 + 'USD']: +token1_invested_value * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
            k: +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue),
            r: +liquidityPoolsByBlock[blockNumber]?.priceRatio
          };

          if (token_symbol_0 == liquidityPoolsByBlock[blockNumber].pair.token0.symbol) {
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          } else {
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          }
          
          objectPrintLPHolding[token_symbol_0 + "tUSD"] = objectPrintLPHolding[token_symbol_0 + "t"]* liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0];
          objectPrintLPHolding[token_symbol_1 + "tUSD"] = objectPrintLPHolding[token_symbol_1 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1];

          objectPrintLPHolding.totalUSD = objectPrintLPHolding[token_symbol_0 + "USD"] + objectPrintLPHolding[token_symbol_1 + "USD"];
          objectPrintLPHolding.totaltUSD = objectPrintLPHolding[token_symbol_0 + "tUSD"] + objectPrintLPHolding[token_symbol_1 + "tUSD"];

          objectPrintLPHolding.ilUSD = objectPrintLPHolding.totalUSD - objectPrintLPHolding.totaltUSD;
          objectPrintLPHolding.ilPer = objectPrintLPHolding.ilUSD / objectPrintLPHolding.totaltUSD * 100;

          liquidity_pool[pool_name].push({
            block: blockNumber,
            assets: objectPrint,
            details: objectPrintHolding,
            il: objectPrintLPHolding,
            date: moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD"),
            type: "Remove",
            value: blocks[blockNumber].out[0].tokenValue,
            tokensIn: blocks[blockNumber].in,
            tokensOut: blocks[blockNumber].out,
            tokenPrices: liquidityPoolsByBlock[blockNumber]?.priceUSD,
            reward: liquidity_pool_rewards[pool_name]
          });
        } else if (blocks[blockNumber]["platform"].tname.indexOf("Stake Again") !== -1) {

          let temp_assets = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].assets;
          let temp_assets_tokens = Object.keys(temp_assets);

          let objectPrint = {};

          let temp_details = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].details;
          let holdingPer = temp_details.holdingLPToken / liquidityPoolsByBlock[blockNumber]?.supplyLPToken * 100;

          let objectPrintHolding = {
            chain:chain,
            holding: holdingPer,
            poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
            gasFee: parseFloat(blocks[blockNumber].gasFee),
            gasFeeCumu:liquidity_pool_gasfees[pool_name],
            invested: temp_details.invested,
            withdrawn: temp_details.withdrawn,
            reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
            holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
            holdingLPToken: temp_details.holdingLPToken,
            balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
            supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
            valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
          };  

          objectPrint[temp_assets_tokens[0]] = {
            ...temp_assets[temp_assets_tokens[0]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[0]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]]
          }

          objectPrint[temp_assets_tokens[1]] = {
            ...temp_assets[temp_assets_tokens[1]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[1]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]]
          }

          let token_symbol_0 = Object.keys(liquidity_pool_assets[pool_name])[0];
          let token_symbol_1 = Object.keys(liquidity_pool_assets[pool_name])[1];

          let objectPrintLPHolding = {
            [token_symbol_0]: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
            [token_symbol_1]: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
            [token_symbol_0 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
            [token_symbol_1 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
            k: +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue),
            r: +liquidityPoolsByBlock[blockNumber]?.priceRatio
          };

          if (token_symbol_0 == liquidityPoolsByBlock[blockNumber].pair.token0.symbol) {
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          } else {
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          }
          
          objectPrintLPHolding[token_symbol_0 + "tUSD"] = objectPrintLPHolding[token_symbol_0 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0];
          objectPrintLPHolding[token_symbol_1 + "tUSD"] = objectPrintLPHolding[token_symbol_1 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1];

          objectPrintLPHolding.totalUSD = objectPrintLPHolding[token_symbol_0 + "USD"] + objectPrintLPHolding[token_symbol_1 + "USD"];
          objectPrintLPHolding.totaltUSD = objectPrintLPHolding[token_symbol_0 + "tUSD"] + objectPrintLPHolding[token_symbol_1 + "tUSD"];

          objectPrintLPHolding.ilUSD = objectPrintLPHolding.totalUSD - objectPrintLPHolding.totaltUSD;
          objectPrintLPHolding.ilPer = objectPrintLPHolding.ilUSD / objectPrintLPHolding.totaltUSD * 100;

          if (Object.keys(liquidity_pool_rewards[pool_name]) == 0) {
            let rewardtoken = uniqueTokens[(blocks[blockNumber].transactions[0].contractAddress).toLowerCase()]
            liquidity_pool_rewards[pool_name] = {
              ...rewardtoken,
              tokenValue: +blocks[blockNumber].transactions[0].value / Math.pow(10, rewardtoken.decimal),
              value: +blocks[blockNumber].transactions[0].value
            }
          } else {
            liquidity_pool_rewards[pool_name]["tokenValue"] += blocks[blockNumber].transactions[0].value / Math.pow(10, liquidity_pool_rewards[pool_name].decimal);
          }

          liquidity_pool[pool_name].push({
            block: blockNumber,
            assets: objectPrint,
            details: objectPrintHolding,
            il: objectPrintLPHolding,
            date: moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD"),
            type: "Stake Again",
            value: blocks[blockNumber].out[0].tokenValue,
            tokensIn: blocks[blockNumber].in,
            tokensOut: blocks[blockNumber].out,
            tokenPrices: liquidityPoolsByBlock[blockNumber]?.priceUSD,
            reward: liquidity_pool_rewards[pool_name]
          });
        } else if (blocks[blockNumber]["platform"].tname.indexOf("Stake") !== -1) {

          let temp_assets = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].assets;
          let temp_assets_tokens = Object.keys(temp_assets);

          let objectPrint = {};

          let temp_details = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].details;
          let holdingPer = temp_details.holdingLPToken / liquidityPoolsByBlock[blockNumber]?.supplyLPToken * 100;

          let objectPrintHolding = {
            chain:chain,
            holding: holdingPer,
            poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
            gasFee: parseFloat(blocks[blockNumber].gasFee),
            gasFeeCumu:liquidity_pool_gasfees[pool_name],
            invested: temp_details.invested,
            withdrawn: temp_details.withdrawn,
            reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
            holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
            holdingLPToken: temp_details.holdingLPToken,
            balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
            supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
            valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
          };  

          objectPrint[temp_assets_tokens[0]] = {
            ...temp_assets[temp_assets_tokens[0]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[0]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]]
          }

          objectPrint[temp_assets_tokens[1]] = {
            ...temp_assets[temp_assets_tokens[1]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[1]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]]
          }

          let token_symbol_0 = Object.keys(liquidity_pool_assets[pool_name])[0];
          let token_symbol_1 = Object.keys(liquidity_pool_assets[pool_name])[1];
          
          let objectPrintLPHolding = {
            [token_symbol_0]: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
            [token_symbol_1]: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
            [token_symbol_0 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
            [token_symbol_1 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
            k: +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue),
            r: +liquidityPoolsByBlock[blockNumber]?.priceRatio
          };

          if (token_symbol_0 == liquidityPoolsByBlock[blockNumber].pair.token0.symbol) {
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          } else {
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          }

          objectPrintLPHolding[token_symbol_0 + "tUSD"] = objectPrintLPHolding[token_symbol_0 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0];
          objectPrintLPHolding[token_symbol_1 + "tUSD"] = objectPrintLPHolding[token_symbol_1 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1];

          objectPrintLPHolding.totalUSD = objectPrintLPHolding[token_symbol_0 + "USD"] + objectPrintLPHolding[token_symbol_1 + "USD"];
          objectPrintLPHolding.totaltUSD = objectPrintLPHolding[token_symbol_0 + "tUSD"] + objectPrintLPHolding[token_symbol_1 + "tUSD"];

          objectPrintLPHolding.ilUSD = objectPrintLPHolding.totalUSD - objectPrintLPHolding.totaltUSD;
          objectPrintLPHolding.ilPer = objectPrintLPHolding.ilUSD / objectPrintLPHolding.totaltUSD * 100;

          liquidity_pool[pool_name].push({
            block: blockNumber,
            assets: objectPrint,
            details: objectPrintHolding,
            il: objectPrintLPHolding,
            date: moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD"),
            type: "Stake",
            value: blocks[blockNumber].out[0].tokenValue,
            tokensIn: blocks[blockNumber].in,
            tokensOut: blocks[blockNumber].out,
            tokenPrices: liquidityPoolsByBlock[blockNumber]?.priceUSD,
            reward: liquidity_pool_rewards[pool_name]
          });
        } else if (blocks[blockNumber]["platform"].tname.indexOf("Unstake") !== -1) {

          let temp_assets = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].assets;
          
          let temp_assets_tokens = Object.keys(temp_assets);

          let objectPrint = {};

          let temp_details = liquidity_pool[pool_name][liquidity_pool[pool_name].length - 1].details;
          let holdingPer = temp_details.holdingLPToken / liquidityPoolsByBlock[blockNumber]?.supplyLPToken * 100;

          let objectPrintHolding = {
            chain:chain,
            holding: holdingPer,
            poolname: liquidityPoolsByBlock[blockNumber]?.poolname,
            gasFee: parseFloat(blocks[blockNumber].gasFee),
            gasFeeCumu:liquidity_pool_gasfees[pool_name],
            invested: temp_details.invested,
            withdrawn: temp_details.withdrawn,
            reserveUSD: liquidityPoolsByBlock[blockNumber]?.reserveUSD,
            holdingUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD * holdingPer * 0.01).toFixed(4),
            holdingLPToken: temp_details.holdingLPToken,
            balanceLPToken: liquidityPoolsByBlock[blockNumber]?.balanceLPToken,
            supplyLPToken: liquidityPoolsByBlock[blockNumber]?.supplyLPToken,
            valueLPTokenUSD: +(liquidityPoolsByBlock[blockNumber]?.reserveUSD / liquidityPoolsByBlock[blockNumber]?.supplyLPToken).toFixed(4)
          };  

          objectPrint[temp_assets_tokens[0]] = {
            ...temp_assets[temp_assets_tokens[0]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[0]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[0]]
          }

          objectPrint[temp_assets_tokens[1]] = {
            ...temp_assets[temp_assets_tokens[1]],
            addedUSD: 0,
            withdrawnUSD: 0,
            currentUSD: temp_assets[temp_assets_tokens[1]].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]],
            tokenPrice: liquidityPoolsByBlock[blockNumber]?.priceUSD[temp_assets_tokens[1]]
          }

          let token_symbol_0 = Object.keys(liquidity_pool_assets[pool_name])[0];
          let token_symbol_1 = Object.keys(liquidity_pool_assets[pool_name])[1];

          let objectPrintLPHolding = {
            [token_symbol_0]: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue,
            [token_symbol_1]: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue,
            [token_symbol_0 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0],
            [token_symbol_1 + 'USD']: +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1],
            k: +(+liquidity_pool_assets[pool_name][token_symbol_0].tokenValue * +liquidity_pool_assets[pool_name][token_symbol_1].tokenValue),
            r: +liquidityPoolsByBlock[blockNumber]?.priceRatio
          };

          if (token_symbol_0 == liquidityPoolsByBlock[blockNumber].pair.token0.symbol) {
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          } else {
            objectPrintLPHolding[token_symbol_1 + "t"] = Math.sqrt(objectPrintLPHolding.k / objectPrintLPHolding.r);
            objectPrintLPHolding[token_symbol_0 + "t"] = Math.sqrt(objectPrintLPHolding.k * objectPrintLPHolding.r);
          }

          objectPrintLPHolding[token_symbol_0 + "tUSD"] = objectPrintLPHolding[token_symbol_0 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_0];
          objectPrintLPHolding[token_symbol_1 + "tUSD"] = objectPrintLPHolding[token_symbol_1 + "t"] * liquidityPoolsByBlock[blockNumber]?.priceUSD[token_symbol_1];

          objectPrintLPHolding.totalUSD = objectPrintLPHolding[token_symbol_0 + "USD"] + objectPrintLPHolding[token_symbol_1 + "USD"];
          objectPrintLPHolding.totaltUSD = objectPrintLPHolding[token_symbol_0 + "tUSD"] + objectPrintLPHolding[token_symbol_1 + "tUSD"];

          objectPrintLPHolding.ilUSD = objectPrintLPHolding.totalUSD - objectPrintLPHolding.totaltUSD;
          objectPrintLPHolding.ilPer = objectPrintLPHolding.ilUSD / objectPrintLPHolding.totaltUSD * 100;

          if (Object.keys(liquidity_pool_rewards[pool_name]) == 0) {
            let rewardtoken = uniqueTokens[(blocks[blockNumber].transactions[0].contractAddress).toLowerCase()]
            liquidity_pool_rewards[pool_name] = {
              ...rewardtoken,
              tokenValue: +blocks[blockNumber].transactions[0].value / Math.pow(10, rewardtoken.decimal),
              value: +blocks[blockNumber].transactions[0].value
            }
          } else {
            liquidity_pool_rewards[pool_name]["tokenValue"] += blocks[blockNumber].transactions[0].value / Math.pow(10, liquidity_pool_rewards[pool_name].decimal);
          }
    
          liquidity_pool[pool_name].push({
            block: blockNumber,
            assets: objectPrint,
            details: objectPrintHolding,
            il: objectPrintLPHolding,
            date: moment(blocks[blockNumber].transactions[0].timeStamp * 1000).format("YYYY-MM-DD"),
            type: "Unstake",
            value: blocks[blockNumber].in[0].tokenValue,
            tokensIn: blocks[blockNumber].in,
            tokensOut: blocks[blockNumber].out,
            tokenPrices: liquidityPoolsByBlock[blockNumber]?.priceUSD,
            reward: liquidity_pool_rewards[pool_name]
          });
        } else {

        }
      }
    });
    return liquidity_pool;
  }

  handleEtheriumTokenTransfers = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = {};
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { "platform": { }, "type": "Defi", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        // console.log(transaction["blockNumber"], transaction.value, transaction);
        transaction['type'] = "Token Transfer";
        transaction['tokenLabel'] = transaction['tokenSymbol'];
        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Token Transfer", address: transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval", "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: transaction.from, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: transaction.to, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
        
        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'address':transaction["contractAddress"],
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': parseInt(transaction["tokenDecimal"])
          };
        }
      })

      //store unique contract addresses
      address["uniqueTokens"] = uniqueTokens;
      address["uniqueAddress"] = uniqueAddress;
      localStorage.setItem('uniqueTokens', JSON.stringify(uniqueTokens))
      localStorage.setItem('uniqueAddress', JSON.stringify(uniqueAddress))
      this.setState({
        address: {
          ...this.state.address,
          etheriumTokenTransfers: result.result.slice(0, MAX_COUNT),
          etheriumBlocks: blocks
        }
      })
    }
  }

  handleBinanceTokenTransfers = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = { };
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { "platform": { }, "type": "Defi", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        // console.log(transaction["blockNumber"], transaction.value, transaction);
        transaction['type'] = "Token Transfer";
        transaction['tokenLabel'] = transaction['tokenSymbol'];
        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Token Transfer", address: transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval", "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: transaction.from, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: transaction.to, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' BNB';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'address':transaction["contractAddress"],
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': parseInt(transaction["tokenDecimal"])
          };
        }
      })


      console.log("bnnnnnnb",uniqueTokens);

      //store unique contract addresses
      address["uniqueTokens"] = uniqueTokens;
      address["uniqueAddress"] = uniqueAddress;
      localStorage.setItem('uniqueTokens', JSON.stringify(uniqueTokens))
      localStorage.setItem('uniqueAddress', JSON.stringify(uniqueAddress))
      this.setState({
        address: {
          ...this.state.address,
          binanceTokenTransfers: result.result.slice(0, MAX_COUNT),
          binanceBlocks: blocks
        }
      })
    }
  }

  handlePolygonTokenTransfers = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = { };
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { "platform": { }, "type": "Defi", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        // console.log(transaction["blockNumber"], transaction.value, transaction);
        transaction['type'] = "Token Transfer";
        transaction['tokenLabel'] = transaction['tokenSymbol'];
        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Token Transfer", address: transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval", "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: transaction.from, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: transaction.to, "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'address':transaction["contractAddress"],
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': parseInt(transaction["tokenDecimal"])
          };
        }
      })

      //store unique contract addresses
      address["uniqueTokens"] = uniqueTokens;
      address["uniqueAddress"] = uniqueAddress;
      localStorage.setItem('uniqueTokens', JSON.stringify(uniqueTokens))
      localStorage.setItem('uniqueAddress', JSON.stringify(uniqueAddress))
      this.setState({
        address: {
          ...this.state.address,
          polygonTokenTransfers: result.result.slice(0, MAX_COUNT),
          polygonBlocks: blocks
        }
      })
    }
  }

  handleEtheriumAddressTransactions = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = {...this.state.address["etheriumBlocks"]};
      // console.log(uniqueAddress[address.address]);

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { platform: { }, "type": "Normal", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        // console.log("blocks", blocks[transaction["blockNumber"]]);
        transaction['type'] = "Wallet Transaction";
        
        if (transaction.to == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" && transaction.value > 0) {
          blocks[transaction["blockNumber"]].in.push({ address: transaction.to,"tokenSymbol": "Weth", "tokenName": "Wrapped Ether", "tokenDecimal": "18", "tokenValue": transaction.value })
          var transactiona = {
            ...transaction,
            to: address.address,
            from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            tokenName: "Wrapped Ether",
            tokenSymbol: "WETH",
            tokenDecimal: "18",
            tokenValue: transaction.value,
            type: "Token Transfer"
          };
          uniqueTokens[transaction.to] = {
            'address': transaction.to,
            'name': transactiona["tokenName"],
            'symbol': transactiona["tokenSymbol"],
            'decimal': parseInt(transactiona["tokenDecimal"])
          };
          blocks[transaction["blockNumber"]].transactions.push(transactiona)
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);

        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Transaction", "address": transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval"  })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: address.address, "tokenSymbol": "Eth", "tokenName": "Ethereum", "tokenDecimal": "18", "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: address.address, "tokenSymbol": "Eth", "tokenName": "Ethereum", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        // console.log("uniqueAddress", uniqueAddress);
        // console.log("transaction", blocks[transaction["blockNumber"]]);
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
      })

      localStorage.setItem('etheriumUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('etheriumTransactions', transactions);

      blocks = this.handleLabelling(blocks,"ethereum")
      this.setState({
        address: {
          ...this.state.address,
          etheriumTransactions: result.result.slice(0, MAX_COUNT),
          etheriumBlocks: blocks,
          etheriumliquidityPools: this.handleLiquidityPools(blocks, address.etheriumLiquidityPoolsByBlock, "ethereum"),
          etheriumInvestments: investments["ethereum"],
          etheriumGasFees: gasFees["ethereum"]
        }
      })
    }
  }

  handleBinanceAddressTransactions = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = { ...this.state.address["binanceBlocks"] };
      // console.log(uniqueAddress[address.address]);

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { platform: { }, "type": "Normal", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        // console.log("blocks", blocks[transaction["blockNumber"]]);
        transaction['type'] = "Wallet Transaction";

        if (transaction.to == "0x10ed43c718714eb63d5aa57b78b54704e256024e" && transaction.value > 0) {
          transaction.type = "Token Transfer";
          transaction.tokenName = "Wrapped BNB";
          transaction.tokenSymbol = "WBNB";
          transaction.tokenDecimal = "18";

          uniqueTokens[transaction.to] = {
            'address': transaction.to,
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': parseInt(transaction["tokenDecimal"])
          };
        }
        
        blocks[transaction["blockNumber"]].transactions.push(transaction);

        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Transaction", "address": transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval" })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: address.address, "tokenSymbol": "BNB", "tokenName": "Binance Token", "tokenDecimal": "18", "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: transaction.to, "tokenSymbol": "WBNB", "tokenName": "Wrapped BNB", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        // console.log("uniqueAddress", uniqueAddress);
        // console.log("transaction", blocks[transaction["blockNumber"]]);
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' BNB';
      })

      localStorage.setItem('binanceUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('binanceTransactions', transactions);

      blocks = this.handleLabelling(blocks, "binance")
      this.setState({
        address: {
          ...this.state.address,
          binanceTransactions: result.result.slice(0, MAX_COUNT),
          binanceBlocks: blocks,
          binanceliquidityPools: this.handleLiquidityPools(blocks, address.binanceLiquidityPoolsByBlock, "binance"),
          binanceInvestments: investments["binance"],
          binanceGasFees: gasFees["binance"]
        }
      })
    }
  }

  handlePolygonAddressTransactions = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = { ...this.state.address["polygonBlocks"] };
      // console.log(uniqueAddress[address.address]);

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { platform: { }, "type": "Normal", "transactions": [], "approve": [], "in": [], "out": [] };
        }
        // console.log("blocks", blocks[transaction["blockNumber"]]);
        transaction['type'] = "Wallet Transaction";

        if (transaction.to == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" && transaction.value > 0) {
          blocks[transaction["blockNumber"]].in.push({ address: address.address, "tokenSymbol": "Weth", "tokenName": "Wrapped Ether", "tokenDecimal": "18", "tokenValue": transaction.value })
          var transactiona = {
            ...transaction,
            to: address.address,
            from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            tokenName: "Wrapped Ether",
            tokenSymbol: "WETH",
            tokenDecimal: "18",
            tokenValue: transaction.value,
            type: "Token Transfer"
          };
          blocks[transaction["blockNumber"]].transactions.push(transactiona)
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);

        (transaction.value == "0")
          ? blocks[transaction["blockNumber"]].approve.push({ "type": "Approve Transaction", "address": transaction.to, "name": (uniqueAddress[transaction.to] != undefined) ? uniqueAddress[transaction.to].name : "Unknown Approval" })
          : (transaction.to == address.address)
            ? blocks[transaction["blockNumber"]].in.push({ address: address.address, "tokenSymbol": "Matic", "tokenName": "Matic", "tokenDecimal": "18", "tokenValue": transaction.value })
            : blocks[transaction["blockNumber"]].out.push({ address: address.address, "tokenSymbol": "Matic", "tokenName": "Matic", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        // console.log("uniqueAddress", uniqueAddress);
        // console.log("transaction", blocks[transaction["blockNumber"]]);
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
      })

      localStorage.setItem('polygonUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('polygonTransactions', transactions);

      blocks = this.handleLabelling(blocks,"polygon")
      this.setState({
        address: {
          ...this.state.address,
          polygonTransactions: result.result.slice(0, MAX_COUNT),
          polygonBlocks: blocks,
          polygonliquidityPools: this.handleLiquidityPools(blocks, address.polygonLiquidityPoolsByBlock, "polygon"),
          polygonInvestments: investments["polygon"],
          polygonGasFees: gasFees["polygon"]
        }
      })
    }
  }

  handleEtheriumMinedBlocks = result => {
    if (result.status === '1') {
      this.setState({
        address: {
          ...this.state.address,
          etheriumMinedBlocks: result.result.slice(0, MAX_COUNT)
        }
      })
    }
  }

  handleBinanceMinedBlocks = result => {
    if (result.status === '1') {
      this.setState({
        address: {
          ...this.state.address,
          binanceMinedBlocks: result.result.slice(0, MAX_COUNT)
        }
      })
    }
  }

  handlePolygonMinedBlocks = result => {
    if (result.status === '1') {
      this.setState({
        address: {
          ...this.state.address,
          binanceMinedBlocks: result.result.slice(0, MAX_COUNT)
        }
      })
    }
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.onSearch()
    }
  }

  onSearch = () => {
    const { searchValue } = this.state
    localStorage.setItem('addr', searchValue)
    this.reset()
    if (api.isAddress(searchValue)) {
      ethplorer.getAddressInfo(
        searchValue,
        this.handleAddressInfo,
        this.onError
      )
    } else {
      var re = /0x[0-9A-Fa-f]{64}/g
      const isHash = re.test(searchValue)
      if (isHash) {
        api.getTransaction(searchValue, this.handleTransactionInfo)
      } else {
        this.setState({
          error: `${searchValue} is not a valid txHash`
        })
      }
    }
  }

  onChange = e => this.setState({ searchValue: e.target.value.trim() })

  fromWei = (wei, unit) => {
    return `${api.fromWei(wei, unit)} ${unit[0].toUpperCase()}${unit.slice(1)}`
  }

  getConfirmations = blockNumber => {
    const { currentBlock } = this.state
    if (currentBlock === -1) return ''
    return `(${this.state.currentBlock - blockNumber} confirmations)`
  }

  receiveBlock = (error, block) => {
    if (error) console.error(error.message)
    if (block) {
      this.setState({
        blocks: {
          ...this.state.blocks,
          [block.number]: block
        }
      })
    }
  }

  getBlockTimestamp = blockNumber => {
    const block = this.state.blocks[blockNumber]
    if (block) {
      const timestamp = new Date(block.timestamp * 1000)
      const diff = moment(block.timestamp * 1000).fromNow()
      return `${diff} (${timestamp})`
    } else {
      api.getBlock(blockNumber, this.receiveBlock)
      return ''
    }
  }

  renderMainInfo = () => {
    const {
      error,
      searchFinished,
      transaction,
      receipt,
      block,
      address
    } = this.state
    const notFound = !error && searchFinished && !transaction && !block
    if (address) {
      return (
        <React.Fragment>
          <Grid.Row>
            <Grid.Column>
              {address.contractInfo
                ? <ContractInfo address={address} />
                : <AddressInfo address={address} />}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}  >
                <TabbedContent  address={address} />
            </Grid.Column>

          </Grid.Row>

        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            {notFound &&
              <Message warning>
                <Message.Header>Sorry</Message.Header>
                <p>{'There are no matching entries'}</p>
              </Message>}
          </Grid.Column>
        </Grid.Row>
        {searchFinished &&
          transaction &&
          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <TransactionStatus receipt={receipt} />
                <InfoRow title='From:' content={transaction.from} />
                <InfoRow title='To:' content={transaction.to} />
                <InfoRow
                  title='Value:'
                  content={this.fromWei(transaction.value, 'ether')}
                />
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>}
        {searchFinished &&
          receipt &&
          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <InfoRow
                  title='Block height:'
                  content={`${receipt.blockNumber} ${this.getConfirmations(receipt.blockNumber)}`}
                />
                <InfoRow
                  title='Timestamp:'
                  content={this.getBlockTimestamp(receipt.blockNumber)}
                />
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>}
        {searchFinished &&
          transaction &&
          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <InfoRow title='Gas limit:' content={transaction.gas} />
                <InfoRow
                  title='Gas used by Txn:'
                  content={receipt ? receipt.gasUsed : <em>Pending</em>}
                />
                <InfoRow
                  title='Gas price:'
                  content={this.fromWei(transaction.gasPrice, 'gwei')}
                />
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>}
      </React.Fragment>
    )
  }

  renderHeader = () => {
    const { ethPrice, ethSupply, currentBlock } = this.state
    return (
      <Grid>
        <Grid.Row columns={3}>
          <Grid.Column>
            <Segment.Group>
              <Segment color='blue'>
                <Header>Ether price:</Header>
              </Segment>
              <Segment>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      {ethPrice.ethusd &&
                        <p>{`$${ethPrice.ethusd.toLocaleString()}`}</p>}
                    </Grid.Column>
                    <Grid.Column>
                      {ethPrice.ethbtc &&
                        <p>{`${ethPrice.ethbtc.toLocaleString()} BTC`}</p>}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column>
            <Segment.Group>
              <Segment color='purple'>
                <Header>Market cap</Header>
              </Segment>
              <Segment>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <p
                      >{`$${(api.fromWei(ethSupply + '', 'ether') * ethPrice.ethusd).toLocaleString()}`}</p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column>
            <Segment.Group>
              <Segment color='violet'>
                <Header>Last block:</Header>
              </Segment>
              <Segment>
                <Grid>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      {currentBlock}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  render() {
    const { error } = this.state
    return (
      <Grid container style={{ padding: '1em 0em' }}>
        <Grid.Row width={16}>
          <Grid.Column>
            {this.renderHeader()}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Input
              fluid
              onKeyPress={this.onKeyPress}
              value={this.state.searchValue}
              placeholder='Search by txHash or address'
              onChange={this.onChange}
              action={
                <Button color='teal' icon='search' onClick={this.onSearch} />
              }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {error &&
              <Message error>
                <Message.Header>Something wrong</Message.Header>
                <p>{error}</p>
              </Message>}
          </Grid.Column>
        </Grid.Row>
        {this.renderMainInfo()}
      </Grid>
    )
  }
}

export default App
