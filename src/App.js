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

const MAX_COUNT = 200
var addr = '', uniqueTokens = {}, uniqueAddress = {};
uniqueAddress['0x618ffd1cdabee36ce5992a857cc7463f21272bd7'.toLowerCase()] = {
  'name': 'WazirX',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0x9696f59E4d72E237BE84fFD425DCaD154Bf96976'.toLowerCase()] = {
  'name': 'Binance',
  'type': 'Exchange',
  'tags': ['Exchange']
};

uniqueAddress['0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'.toLowerCase()] = {
  'name': 'SushiSwap',
  'type': 'Application',
  'tags': []
};

uniqueAddress['0xc2edad668740f1aa35e4d8f227fb8e17dca888cd'.toLowerCase()] = {
  'name': 'SushiSwap: MasterChef LP Staking Pool',
  'type': 'Application',
  'tags': ['Staking', 'Yield Farming']
};

uniqueAddress['0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'.toLowerCase()] = {
  'name': 'SushiSwap: Router',
  'type': 'Application',
  'tags': ['Liquidity']
};

uniqueAddress['0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'.toLowerCase()] = {
  'name': 'SushiSwap: SUSHI',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f'.toLowerCase()] = {
  'name': 'SushiSwap: DAI',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0x881D40237659C251811CEC9c364ef91dC08D300C'.toLowerCase()] = {
  'name': 'Metamask: Swap Router',
  'type': 'Application',
  'tags': ['Swapping']
};

uniqueAddress['0x74de5d4fcbf63e00296fd95d33236b9794016631'.toLowerCase()] = {
  'name': 'Metamask: Approve',
  'type': 'Application',
  'tags': ['Approval']
};

uniqueAddress['0x0000000000000000000000000000000000000000'.toLowerCase()] = {
  'name': 'Newly Mined',
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
    this.setState({ address })
    // console.log(address);
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
  }

  handleEtheriumTokenTransfers = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = {};
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = {"platform":{}, "type": "Defi", "transactions": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': transaction["tokenDecimal"]
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
      var blocks = {};
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = {"platform":{}, "type": "Defi", "transactions": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': transaction["tokenDecimal"]
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
          binanceTokenTransfers: result.result.slice(0, MAX_COUNT),
          binanceBlocks: blocks
        }
      })
    }
  }

  handlePolygonTokenTransfers = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = {};
      //find unique tokens
      result.result.map((transaction) => {
        //combine blocks
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { "platform": {}, "type": "Defi", "transactions": [], "in": [], "out": [] };
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": transaction.tokenSymbol, "tokenName": transaction.tokenName, "tokenDecimal": transaction.tokenDecimal, "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
        // store uniqueTokens ;
        if (transaction["contractAddress"] != undefined) {
          uniqueTokens[transaction["contractAddress"]] = {
            'name': transaction["tokenName"],
            'symbol': transaction["tokenSymbol"],
            'decimal': transaction["tokenDecimal"]
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
      var blocks = address["etheriumBlocks"];

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = {"platform":{}, "type": "Normal", "transactions": [], "in": [], "out": [] };
        }
        if (transaction.to == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" && transaction.value > 0) {
          blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Weth", "tokenName": "Wrapped Ether", "tokenDecimal": "18", "tokenValue": blocks.value })
          var transactiona = {
            ...transaction,
            to: address.address,
            from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            tokenName: "Wrapped Ether",
            tokenSymbol: "WETH",
            tokenDecimal: "18",
            tokenValue: blocks.value
          };
          blocks[transaction["blockNumber"]].transactions.push(transactiona);
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        // console.log("uniqueAddress", uniqueAddress);
        // console.log("transaction", blocks[transaction["blockNumber"]]);
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
      })

      localStorage.setItem('etheriumUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('etheriumTransactions', transactions);

      // var datewise = {};
      // Object.keys(etheriumTransactions).map((block) => {
      //   var date_this = moment((etheriumTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD');
      //   if (datewise[date_this] == undefined) {
      //     datewise[moment((etheriumTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')] = {};
      //   }
      //   datewise[moment((etheriumTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')][block] = etheriumTransactions[block];
      // });
      // console.log('dateWise', datewise)

      this.setState({
        address: {
          ...this.state.address,
          etheriumTransactions: result.result.slice(0, MAX_COUNT),
          etheriumBlocks: blocks
        }
      })
    }
  }

  handleBinanceAddressTransactions = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = address["binanceBlocks"];

      // console.log("handleBinanceAddressTransactions",result);
      // console.log("address",address);

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = {"platform":{}, "type": "Normal", "transactions": [], "in": [], "out": [] };
        }
        if (transaction.to == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" && transaction.value > 0) {
          blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Weth", "tokenName": "Wrapped Ether", "tokenDecimal": "18", "tokenValue": blocks.value })
          var transactiona = {
            ...transactions,
            to: address.address,
            from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            tokenName: "Wrapped Ether",
            tokenSymbol: "WETH",
            tokenDecimal: "18",
            tokenValue: blocks.value
          };
          blocks[transaction["blockNumber"]].transactions.push(transactiona);
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
      })

      localStorage.setItem('BinanceUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('BinanceTransactions', transactions);

      // var datewise = {};
      // Object.keys(BinanceTransactions).map((block) => {
      //   var date_this = moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD');
      //   if (datewise[date_this] == undefined) {
      //     datewise[moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')] = {};
      //   }
      //   datewise[moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')][block] = BinanceTransactions[block];
      // });
      // console.log('dateWise', datewise)

      this.setState({
        address: {
          ...this.state.address,
          binanceTransactions: result.result.slice(0, MAX_COUNT),
          binanceBlocks: blocks
        }
      })
    }
  }

  handlePolygonAddressTransactions = result => {
    if (result.status === '1') {
      var address = this.state.address;
      var blocks = address["binanceBlocks"];

      // console.log("handlePolygonAddressTransactions",result);
      // console.log("address",address);

      result.result.map((transaction) => {
        if (blocks[transaction["blockNumber"]] == undefined) {
          blocks[transaction["blockNumber"]] = { "platform": {}, "type": "Normal", "transactions": [], "in": [], "out": [] };
        }
        if (transaction.to == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" && transaction.value > 0) {
          blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Weth", "tokenName": "Wrapped Ether", "tokenDecimal": "18", "tokenValue": blocks.value })
          var transactiona = {
            ...transactions,
            to: address.address,
            from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            tokenName: "Wrapped Ether",
            tokenSymbol: "WETH",
            tokenDecimal: "18",
            tokenValue: blocks.value
          };
          blocks[transaction["blockNumber"]].transactions.push(transactiona);
        }
        blocks[transaction["blockNumber"]].transactions.push(transaction);
        (transaction.to == address.address)
          ? blocks[transaction["blockNumber"]].in.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })
          : blocks[transaction["blockNumber"]].out.push({ "tokenSymbol": "Eth", "tokenName": "Ether Coin", "tokenDecimal": "18", "tokenValue": transaction.value })

        blocks[transaction["blockNumber"]]['type'] = (blocks[transaction["blockNumber"]].type == 'Normal') ? (blocks[transaction["blockNumber"]].in.length > 0) ? 'Wallet Credit' : 'Wallet Debit' : 'Defi Dex';
        switch (blocks[transaction["blockNumber"]]['type']) {
          case 'Wallet Credit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || {};
            break;
          case 'Wallet Debit':
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;

          default:
            blocks[transaction["blockNumber"]]['platform'] = uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].contractAddress.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].from.toLowerCase()] || uniqueAddress[blocks[transaction["blockNumber"]].transactions[0].to.toLowerCase()] || {};
            break;
        }
        blocks[transaction["blockNumber"]]['gasFee'] = (blocks[transaction["blockNumber"]].transactions[0].gasUsed * blocks[transaction["blockNumber"]].transactions[0].gasPrice / Math.pow(10, 18)).toFixed(4) + ' Eth';
      })

      localStorage.setItem('BinanceUniqueAddress', JSON.stringify(uniqueAddress))
      // console.log('BinanceTransactions', transactions);

      // var datewise = {};
      // Object.keys(BinanceTransactions).map((block) => {
      //   var date_this = moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD');
      //   if (datewise[date_this] == undefined) {
      //     datewise[moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')] = {};
      //   }
      //   datewise[moment((BinanceTransactions[block].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')][block] = BinanceTransactions[block];
      // });
      // console.log('dateWise', datewise)

      this.setState({
        address: {
          ...this.state.address,
          polygonTransactions: result.result.slice(0, MAX_COUNT),
          polygonBlocks: blocks
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
      <Grid verticalAlign='center'>
        <Grid.Row columns={3}>
          <Grid.Column>
            <Segment.Group>
              <Segment color='blue'>
                <Header>Ether price:</Header>
              </Segment>
              <Segment>
                <Grid verticalAlign='center'>
                  <Grid.Row verticalAlign='center' columns={2}>
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
                <Grid verticalAlign='center'>
                  <Grid.Row verticalAlign='center' columns={2}>
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
                <Grid verticalAlign='center'>
                  <Grid.Row verticalAlign='center' columns={2}>
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
