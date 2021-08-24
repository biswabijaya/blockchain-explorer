import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import InfoRow from './InfoRow.js'

const AddressInfo = ({ address }) => {
  const withUnit = count => `${count} Ether`
  return (
    <React.Fragment>
      <Segment.Group>
        <Segment color='teal'>
          <Header>Address information</Header>
        </Segment>
        <InfoRow title={'Address'} content={address.address} />
        <InfoRow title={'Balance'} content={withUnit(address.ETH.balance)} />
        <InfoRow title={'Total In'} content={withUnit(address.ETH.totalIn)} />
        <InfoRow title={'Total Out'} content={withUnit(address.ETH.totalOut)} />
        <InfoRow
          title={'Transactions'}
          content={`${address.countTxs.toLocaleString()} txs`}
        />
      </Segment.Group>
    </React.Fragment>
  )
}

export default AddressInfo
