import React from 'react'
import { Segment, Label } from 'semantic-ui-react'
import InfoRow from './InfoRow.js'
import PriceDiffLabel from './PriceDiffLabel.js'



const TokenBalanceInfo = ({ token }) => {
  const amount = token.balance / Math.pow(10, token.tokenInfo.decimals)
  const price = token.tokenInfo.price
  const fiatAmount = (amount * price.rate).toFixed(2)
  const totalSupply = `${(token.tokenInfo.totalSupply / Math.pow(10, token.tokenInfo.decimals)).toLocaleString()} ${token.tokenInfo.symbol}`
  const headerContent = price
    ? <Label.Group size='small'>
      <PriceDiffLabel diff={price.diff} label='24h' />
      <PriceDiffLabel diff={price.diff7d} label='7d' />
      <PriceDiffLabel diff={price.diff30d} label='30d' />
    </Label.Group>
    : null
  return (
    <Segment.Group>
      <InfoRow colored
        h='h3'
        title={`${token.tokenInfo.name} (${token.tokenInfo.symbol})`}
        content={headerContent}
      />
      <InfoRow
        title='Balance'
        content={`${amount} ${token.tokenInfo.symbol}`}
      />
      {price &&
        <InfoRow
          title='Fiat Balance'
          content={`${fiatAmount} ${token.tokenInfo.price.currency}`}
        />}
      {price &&
        <InfoRow
          title='Price'
          content={`${(price.rate * 1).toFixed(2)} ${price.currency}`}
        />}
      <InfoRow title='Contract' content={token.tokenInfo.address} />
      <InfoRow title='Owner' content={token.tokenInfo.owner} />
      <InfoRow title='Holders count' content={token.tokenInfo.holdersCount} />
      <InfoRow title='Total supply' content={totalSupply} />
    </Segment.Group>
  )
}

export default TokenBalanceInfo
