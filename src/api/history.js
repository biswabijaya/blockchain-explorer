import axios from 'axios'

export function getHistoricalPrice(symbol, date) {
  const API = 'http://localhost:3000/crawl/index.php'
  return axios.get(API, {
    params: {
      date: date,
      symbol: symbol
    }
  });
}