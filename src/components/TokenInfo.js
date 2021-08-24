import React from 'react'
import { Grid, Segment, Header, Label } from 'semantic-ui-react'
import InfoRow from './InfoRow.js'
import PriceDiffLabel from './PriceDiffLabel.js'

const TokenInfo = ({ tokenInfo }) => {
  const price = tokenInfo.price
  const totalSupply = `${(tokenInfo.totalSupply / Math.pow(10, tokenInfo.decimals)).toLocaleString()} ${tokenInfo.symbol}`
  const labels = price
    ? <Label.Group size='small'>
      <PriceDiffLabel diff={price.diff} label='24h' />
      <PriceDiffLabel diff={price.diff7d} label='7d' />
      <PriceDiffLabel diff={price.diff30d} label='30d' />
    </Label.Group>
    : null
  const priceContent = price && (
    <Grid>
      <Grid.Column width={3}>{`${(price.rate * 1).toFixed(2)} ${price.currency}`}</Grid.Column>
      <Grid.Column width={13}>{labels}</Grid.Column>
    </Grid>
  )
  return (
    <Segment.Group>
      <Segment color='violet'>
        <Header>Token information</Header>
      </Segment>
      <InfoRow title='Name' content={tokenInfo.name} />
      <InfoRow title='Sumbol' content={tokenInfo.symbol} />
      <InfoRow title='Total supply' content={totalSupply} />
      <InfoRow title='Decimals' content={tokenInfo.decimals} />
      <InfoRow title='Owner' content={tokenInfo.owner} />
      <InfoRow title='Holders count' content={tokenInfo.holdersCount} />
      {price &&
        <InfoRow
          title='Price'
          content={priceContent}
        />}
      {price &&
      <InfoRow
        title='Market cap'
        width="100%"
        content={`${price.marketCapUsd.toLocaleString()} ${price.currency}`}
      />}
    </Segment.Group>
  )
}

export default TokenInfo
