import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import InfoRow from './InfoRow.js'
import TokenInfo from './TokenInfo.js'

const ContractInfo = ({ address }) => {
  const withUnit = count => `${count} Ether`

  return (
    <React.Fragment>
      <Segment.Group>
        <Segment color='teal'>
          <Header>Contract information</Header>
        </Segment>
        <InfoRow title={'Address'} content={address.address} />
        <InfoRow
          title={'Creator'}
          content={address.contractInfo.creatorAddress}
        />
        <InfoRow title={'Balance'} content={withUnit(address.ETH.balance)} />
        <InfoRow
          title={'Transactions'}
          content={`${address.countTxs.toLocaleString()} txs`}
        />
      </Segment.Group>
      <TokenInfo tokenInfo={address.tokenInfo} />
    </React.Fragment>
  )
}

export default ContractInfo
