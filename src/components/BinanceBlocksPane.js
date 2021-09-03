import React from 'react'
import { Card, Table, Grid, Image } from 'semantic-ui-react'
import Moment from 'moment'

//Get List of token
const tokens = JSON.parse(localStorage.getItem('uniqueTokens'))
const contracts = JSON.parse(localStorage.getItem('uniqueAddress'))
const emptywallet = '0x0000000000000000000000000000000000000000';

var cumuGas = 0;
var cumuValue = {
  "BNB": 0
}

const BinanceBlocksPane = ({ address }) => {
  console.log('BinanceliquidityPools', address.binanceliquidityPools);
  console.log('BinanceBlocksPane', address.binanceBlocks);
  var i = 1;
  if (!address.binanceBlocks) return null
  return (
    <>
      <Card.Group itemsPerRow={1} stackable={true} doubling={true}>
        {Object.keys(address.binanceBlocks).map((blockKey) => (
          <Card key={blockKey} className="fluid">
            <Card.Content>
              <Card.Header>
                <Grid columns='four' divided>
                  <Grid.Row>
                    <Grid.Column style={{ wordWrap: "break-word", fontWeight: "300", fontSize: "12px" }}>
                      <Grid.Row style={{ fontWeight: "1000", fontSize: "16px", marginBottom: "5px" }}> <a href={"https://bscscan.com/tx/" + address.binanceBlocks[blockKey].transactions[0].hash} target="_blank"> {`Block - ${blockKey}`} </a> </Grid.Row>
                      <Grid.Row> {`${Moment((address.binanceBlocks[blockKey].transactions[0].timeStamp * 1000)).format('YYYY-MM-DD')}`} </Grid.Row>
                      <Grid.Row> {`${Moment((address.binanceBlocks[blockKey].transactions[0].timeStamp * 1000)).format('hh:mm:ss a')}`} </Grid.Row>
                      <Grid.Row> {`${Moment((address.binanceBlocks[blockKey].transactions[0].timeStamp * 1000)).fromNow()}`} </Grid.Row>
                    </Grid.Column>
                    <Grid.Column style={{ wordWrap: "break-word", fontWeight: "300", fontSize: "10px" }}>
                      <Grid.Row style={{ fontWeight: "1000", fontSize: "16px", marginBottom: "5px" }}> {address.binanceBlocks[blockKey].platform.tname || "Not Found"} </Grid.Row>
                      <Grid.Row> {address.binanceBlocks[blockKey].platform.name || "My Wallet"} </Grid.Row>
                      <Grid.Row> {address.binanceBlocks[blockKey].platform.address || address.address} </Grid.Row>
                      <Grid.Row> {`${Object.keys(address.binanceBlocks[blockKey].in).length} In, ${Object.keys(address.binanceBlocks[blockKey].out).length} Out, ${Object.keys(address.binanceBlocks[blockKey].approve).length} Approve`} </Grid.Row>
                    </Grid.Column>
                    <Grid.Column style={{ wordWrap: "break-word", fontWeight: "300", fontSize: "14px" }}>
                      <Grid.Row style={{ fontWeight: "1000", fontSize: "16px", marginBottom: "5px" }}>
                        {(address.binanceBlocks[blockKey].blockLabel != undefined)
                          ? <button> {`Track ${(address.binanceBlocks[blockKey].blockLabel)}`} </button>
                          : ""}
                      </Grid.Row>
                      {(address.binanceBlocks[blockKey].in.length > 0 && address.binanceBlocks[blockKey].out.length > 0)
                        ? <Grid.Row style={{ fontWeight: "600", fontSize: "16px" }}>
                          <Grid columns='two' divided>
                            <Grid.Row>
                              <Grid.Column>
                                {address.binanceBlocks[blockKey].out.map((trr, keyr) => (
                                  <Grid.Row>
                                    {(trr.tokenValue > 0) ? (trr.tokenValue / Math.pow(10, trr.tokenDecimal || 18)).toFixed(2) + ' ' + (trr.tokenSymbol || 'BNB ') : ''}
                                  </Grid.Row>
                                ))}
                              </Grid.Column>
                              <Grid.Column>
                                {address.binanceBlocks[blockKey].in.map((trr, keyr) => (
                                  <Grid.Row>
                                    {(trr.tokenValue > 0) ? (trr.tokenValue / Math.pow(10, trr.tokenDecimal || 18)).toFixed(2) + ' ' + (trr.tokenSymbol || 'BNB ') : ''}
                                  </Grid.Row>
                                ))}
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Grid.Row>
                        : ''}
                    </Grid.Column>
                    <Grid.Column>
                      <Grid.Row>
                        <Image src='../assets/gasfee.svg' /> &nbsp;
                        {`${cumuGasFee(parseFloat(address.binanceBlocks[blockKey].gasFee))} BNB`}
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Header>
            </Card.Content>
            <Card.Content extra>
              {address.binanceBlocks[blockKey].transactions.map((tr, key) => (
                <Grid columns='four' divided>
                  <Grid.Row>
                    <Grid.Column>
                      <Grid.Row style={{ wordWrap: "break-word", fontWeight: "200", fontSize: "12px", marginBottom: "5px" }}>
                          {(tr.from == address.address) ? ' ' : (contracts[tr.from] != undefined) ? contracts[tr.from].name : (tokens[tr.from] != undefined) ? tokens[tr.from].name : "SomeWallet (" + tr.from + ")"}
                          {(tr.to == address.address) ? ' ' : (contracts[tr.to] != undefined) ? contracts[tr.to].name : (tokens[tr.to] != undefined) ? tokens[tr.to].name : "SomeWallet (" + tr.to + ")"}
                      </Grid.Row>
                      {/* trade exchange */}
                      {/* <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik03LjY0MTc1IDExQzE2LjIxMDIgMTEgMTQuODEgMTAuOTk5OSAxNi44MTIzIDEwLjk5OThDMTcuMDYyNiAxMC43NDc5IDE3LjA2MjYgMTAuMTUzOSAxNi44MTIzIDkuOTAxOTlMMTQuMjQ3MyA3LjE4ODkyQzEzLjk5NyA2LjkzNzAzIDEzLjU5MjcgNi45MzcwMyAxMy4zNDI0IDcuMTg4OTJDMTMuMjIyMyA3LjMwOTYgMTMuMTU0NyA3LjQ3MzQzIDEzLjE1NDcgNy42NDQyN0MxMy4xNTQ3IDcuODE1MTIgMTMuMjIyMyA3Ljk3ODk1IDEzLjM0MjQgOC4wOTk2M0wxNC44MSA5LjcwODIyTDcuNjQxNzUgOS43MDgyMkM3LjI4ODc5IDkuNzA4MjIgNyA5Ljk5ODg3IDcgMTAuMzU0MUM3IDEwLjcwOTMgNy4yODg3OSAxMSA3LjY0MTc1IDExWiIgZmlsbD0iIzE1MTUxRiIvPgo8cGF0aCBkPSJNMTYuMzU4MyAxM0M3Ljc4OTgzIDEzIDkuMTg5OTYgMTMuMDAwMSA3LjE4NzcxIDEzLjAwMDJDNi45Mzc0MyAxMy4yNTIxIDYuOTM3NDMgMTMuODQ2MSA3LjE4NzcxIDE0LjA5OEw5Ljc1MjcgMTYuODExMUMxMC4wMDMgMTcuMDYzIDEwLjQwNzMgMTcuMDYzIDEwLjY1NzYgMTYuODExMUMxMC43Nzc3IDE2LjY5MDQgMTAuODQ1MyAxNi41MjY2IDEwLjg0NTMgMTYuMzU1N0MxMC44NDUzIDE2LjE4NDkgMTAuNzc3NyAxNi4wMjEgMTAuNjU3NiAxNS45MDA0TDkuMTg5OTYgMTQuMjkxOEwxNi4zNTgzIDE0LjI5MThDMTYuNzExMiAxNC4yOTE4IDE3IDE0LjAwMTEgMTcgMTMuNjQ1OUMxNyAxMy4yOTA3IDE2LjcxMTIgMTMgMTYuMzU4MyAxM1oiIGZpbGw9IiMxNTE1MUYiLz4KPC9nPgo8L3N2Zz4K' /> */}
                      {/* contract */}
                      {/* <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC4wMDEzIDUuMzMzOThDNy4yNjc5NyA1LjMzMzk4IDYuNjc0NjQgNS45MzM5OCA2LjY3NDY0IDYuNjY3MzJMNi42Njc5NyAxNy4zMzRDNi42Njc5NyAxOC4wNjczIDcuMjYxMyAxOC42NjczIDcuOTk0NjQgMTguNjY3M0gxNi4wMDEzQzE2LjczNDYgMTguNjY3MyAxNy4zMzQ2IDE4LjA2NzMgMTcuMzM0NiAxNy4zMzRWOS4zMzM5OEwxMy4zMzQ2IDUuMzMzOThIOC4wMDEzWk05LjAwMzEyIDYuNjY3MTlDOC40NTMxMiA2LjY2NzE5IDguMDA4MTIgNy4xNDcxOSA4LjAwODEyIDcuNzMzODVMOC4wMDMxMiAxNi4yNjcyQzguMDAzMTIgMTYuODUzOSA4LjQ0ODEyIDE3LjMzMzkgOC45OTgxMyAxNy4zMzM5SDE1LjAwMzFDMTUuNTUzMSAxNy4zMzM5IDE2LjAwMzEgMTYuODUzOSAxNi4wMDMxIDE2LjI2NzJWOS44NjcxOUwxMy4wMDMxIDYuNjY3MTlIOS4wMDMxMlpNMTIuMDAzMSAxMC42Njc3VjcuMzM0MzdMMTUuMzM2NSAxMC42Njc3SDEyLjAwMzFaIiBmaWxsPSIjMkMyQzM1Ii8+CjwvZz4KPC9zdmc+Cg==' /> */}
                      {/* outgoing */}
                      {/* <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==' /> */}
                      {/* incoming */}
                      {/* <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K' /> */}
                    </Grid.Column>
                    <Grid.Column>
                      {(tr.value == 0) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC4wMDEzIDUuMzMzOThDNy4yNjc5NyA1LjMzMzk4IDYuNjc0NjQgNS45MzM5OCA2LjY3NDY0IDYuNjY3MzJMNi42Njc5NyAxNy4zMzRDNi42Njc5NyAxOC4wNjczIDcuMjYxMyAxOC42NjczIDcuOTk0NjQgMTguNjY3M0gxNi4wMDEzQzE2LjczNDYgMTguNjY3MyAxNy4zMzQ2IDE4LjA2NzMgMTcuMzM0NiAxNy4zMzRWOS4zMzM5OEwxMy4zMzQ2IDUuMzMzOThIOC4wMDEzWk05LjAwMzEyIDYuNjY3MTlDOC40NTMxMiA2LjY2NzE5IDguMDA4MTIgNy4xNDcxOSA4LjAwODEyIDcuNzMzODVMOC4wMDMxMiAxNi4yNjcyQzguMDAzMTIgMTYuODUzOSA4LjQ0ODEyIDE3LjMzMzkgOC45OTgxMyAxNy4zMzM5SDE1LjAwMzFDMTUuNTUzMSAxNy4zMzM5IDE2LjAwMzEgMTYuODUzOSAxNi4wMDMxIDE2LjI2NzJWOS44NjcxOUwxMy4wMDMxIDYuNjY3MTlIOS4wMDMxMlpNMTIuMDAzMSAxMC42Njc3VjcuMzM0MzdMMTUuMzM2NSAxMC42Njc3SDEyLjAwMzFaIiBmaWxsPSIjMkMyQzM1Ii8+CjwvZz4KPC9zdmc+Cg==' /> : (tr.to == address.address) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K' /> : <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==' />}
                      {(tr.value == 0) ? " Approve Transaction" : (tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(4) + ' '}
                      {(tr.value == 0) ? " " : (tr.tokenSymbol || 'BNB ')}
                      {(tr.value == 0) ? " " : (tr.to == address.address) ? ' In' : ' Out'}
                    </Grid.Column>
                    <Grid.Column>
                      <Grid.Row>
                        {(tr.value == 0) ? " " : 'Balance: '}
                        {(tr.value == 0) ? " " : cumuTokenValue(tr.tokenSymbol || 'BNB', (tr.value / Math.pow(10, 18)), (tr.to === address.address))}
                        {(tr.value == 0) ? " " : (tr.tokenSymbol || ' BNB')}
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                      {tr.type}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ))}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <Card className="fluid">
        <Card.Content>
          <Card.Header>
            <Grid columns='three' divided>
              <Grid.Row>
                <Grid.Column>
                  {`Total`}
                </Grid.Column>
                <Grid.Column>
                  {`Assets`}
                </Grid.Column>
                <Grid.Column>
                  <Image src='../assets/gasfee.svg' /> &nbsp;
                  {`Gas Fees ${cumuGasFee(0)} BNB`}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          {Object.keys(cumuValue).map((token) => (
            <Grid columns='three' divided>
              <Grid.Row>
                <Grid.Column>

                </Grid.Column>
                <Grid.Column>
                  {`${token} : ${cumuValue[token]}`}
                </Grid.Column>
                <Grid.Column>

                </Grid.Column>
              </Grid.Row>
            </Grid>
          ))}
        </Card.Content>
      </Card>
    </>
  )
}

function cumuGasFee(gasFee, returnable = true) {
  // console.log(gasFee);
  cumuGas += gasFee;
  if (returnable)
    return cumuGas.toFixed(4);
  else
    return ' ';
}

function cumuTokenValue(tokenSymbol, tokenValue, credit = false) {
  if (cumuValue[tokenSymbol] == undefined) {
    cumuValue[tokenSymbol] = 0;
  }

  cumuValue[tokenSymbol] = credit ? cumuValue[tokenSymbol] + tokenValue : cumuValue[tokenSymbol] - tokenValue;
  return cumuValue[tokenSymbol].toFixed(4);
}

export default BinanceBlocksPane