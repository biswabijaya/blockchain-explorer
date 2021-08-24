import { Ethplorer } from 'ethplorer-js'
import axios from 'axios'
import { config } from '../config'


const ethplorer = new Ethplorer()

export function getAddressInfo (address, resolve, reject) {
  ethplorer.getAddressInfo(address)
    .then(resolve, reject)
    .catch(reject)
}

export function getAddressTransactions (address, resolve, reject) {
  ethplorer.getAddressTransactions(address)
    .then(resolve, reject)
    .catch(reject)
}

export function getTokenInfo (address, resolve, reject) {
  // ethplorer.getTokenPriceHistoryGrouped(address)
  //   .then(resolve, reject)
  //   .catch(reject)
  const API = 'http://api.ethplorer.io'
  axios.get(`${API}/getTokenPriceHistoryGrouped/${address}?apiKey=${config.ethplorerKey}`, {
    params: {
      period: 30
    }
  })
    .then(response => resolve(response.data), reject)
    .catch(reject)
}

export default ethplorer