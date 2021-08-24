import React from 'react'
import { Table, Grid } from 'semantic-ui-react'
import Moment from 'moment'
import TransactionType from './TransactionType'

//Get List of token
const tokens = JSON.parse(localStorage.getItem('uniqueTokens'))
const emptywallet = '0x0000000000000000000000000000000000000000';

const BinanceTokenTransfersPane = ({ address }) => {
  // console.log(address.binanceTokenTransfers.length);
  var i = 1;
  if (!address.binanceTokenTransfers) return null
  return (
    <Table celled>
      <Table.Header>
        <Table.Row textAlign='center'>
          <Table.HeaderCell>
            Tx
          </Table.HeaderCell>
          <Table.HeaderCell>
            Block
          </Table.HeaderCell>
          <Table.HeaderCell>
            Age
          </Table.HeaderCell>
          <Table.HeaderCell>
            Type
          </Table.HeaderCell>
          <Table.HeaderCell>
            Value
          </Table.HeaderCell>
          <Table.HeaderCell>
            Gas Fees
          </Table.HeaderCell>
          <Table.HeaderCell>
            Token
          </Table.HeaderCell>
          <Table.HeaderCell>
            Kind
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {address.binanceTokenTransfers.map((tr, key) => (
          <Table.Row key={key}>
            <Table.Cell width={4}>
              <Grid verticalAlign='middle'>
                <Grid.Column>
                  {`${i++}`/* <Grid.Row>
                    <p><strong>TxHash: </strong>{tr.hash}</p>
                  </Grid.Row> */}
                  <Grid.Row>
                    <p><strong>From: </strong>{(tr.from == address.address) ? 'MyWallet' : (tokens[tr.from] != undefined) ? tokens[tr.from].name : "SomeWallet (" + tr.from + ")"}</p>
                  </Grid.Row>
                  <Grid.Row>
                    <p><strong>To  &nbsp; &nbsp; : </strong>{(tr.to == address.address) ? 'MyWallet' : (tokens[tr.to] != undefined) ? tokens[tr.to].name : "SomeWallet (" + tr.to + ")"}</p>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Table.Cell>
            <Table.Cell>
              {tr.blockNumber}
            </Table.Cell>
            <Table.Cell width={2}>
              <Grid verticalAlign='middle'>
                <Grid.Column>
                  <Grid.Row>
                    {`${Moment((tr.timeStamp * 1000)).format('YYYY-MM-DD HH:mm a')}`}
                  </Grid.Row>
                  <Grid.Row>
                    {`${Moment((tr.timeStamp * 1000)).fromNow()}`}
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Table.Cell>
            <Table.Cell>
              <TransactionType
                transaction={tr}
                address={address.address}
              />
            </Table.Cell>
            <Table.Cell textAlign='center'>
              {`${(tr.value / Math.pow(10, 18)).toFixed(2)}`}
            </Table.Cell>
            <Table.Cell textAlign='center'>
              {`${(tr.gasUsed * tr.gasPrice / Math.pow(10, 18)).toFixed(4)}`}
            </Table.Cell>
            <Table.Cell textAlign='center'>
              {tr.tokenName || 'ERC20'}
            </Table.Cell>
            <Table.Cell textAlign='center'>
              {(tokens[tr.to] != undefined && tokens[tr.to].name.includes('LP Token')) ? 'Add to Liquidity Pool' : (tokens[tr.from] != undefined && tokens[tr.from].name.includes('LP Token')) ? 'Withdraw from Liquidity Pool' : (tr.from == emptywallet) ? 'Stake Assets' : (tr.tokenName.includes('LP Token')) ? 'Yield Farming' : 'Swap Transaction'}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default BinanceTokenTransfersPane