import React from 'react'
import { Table, Grid } from 'semantic-ui-react'
import * as api from '../api/web3Wrapper'
import TransactionType from './TransactionType'
import tokens from '../data/tokens.json'
import Moment from 'moment';

const PolygonTransactionsPane = ({ address }) => {
  // console.log(address.polygonTransactions);
  if (!address.polygonTransactions) return null
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
            Type
          </Table.HeaderCell>
          <Table.HeaderCell>
            Value
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {address.polygonTransactions.map((tr, key) => (
          <Table.Row key={key}>
            <Table.Cell>
            <Grid verticalAlign='middle'>
              <Grid.Column>
                <Grid.Row>
                    <p><strong>TxHash: </strong>{tr.hash} {Moment(tr.timeStamp*1000).format('YYYY-MM-DD HH:MM:SS')}</p>
                </Grid.Row>
                <Grid.Row>
                  <p><strong>From: </strong>{(tr.from == address.address) ? 'MyWallet' : (tokens[tr.from] != undefined) ? tokens[tr.from].name : "SomeContract (" + tr.from + ")"}</p>
                </Grid.Row>
                <Grid.Row>
                    <p><strong>To  &nbsp; &nbsp; : </strong>{(tr.to == address.address) ? 'MyWallet' : (tokens[tr.to] != undefined) ? tokens[tr.to].name : "SomeContract (" + tr.to + ")"}</p>
                </Grid.Row>
              </Grid.Column>
            </Grid>
            </Table.Cell>
            <Table.Cell>
              {tr.blockNumber}
            </Table.Cell>
            <Table.Cell>
              <TransactionType
                transaction={tr}
                address={address.address}
              />
            </Table.Cell>
            <Table.Cell textAlign='center'>
              {`${parseFloat(api.fromWei(tr.value, 'ether')).toFixed(2)} MATIC`}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default PolygonTransactionsPane