import bscscanApi from 'bscscan-api'
import axios from 'axios'
import { config } from '../config'

const api = bscscanApi.init(config.bscscanApiKey)

export function getTokenTransfers (address) {
  return api.account.tokentx(address, null, 1, 'latest', 'desc');
}

export function getTransactions (address) {
  return api.account.txlist(address, 1, 'latest', 'desc')
}

export function getInternalTransactions(txhash, address, startblock=0, endblock=999999999999, sort='asc') {
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
  const API = 'http://api.bscscan.io/'
  return axios.get(`${API}/api?module=token&action=tokeninfo&contractaddress=${contractAddress}&apiKey=${config.bscscanApiKey}`, {
    params: {
      period: 30
    }
  })
}