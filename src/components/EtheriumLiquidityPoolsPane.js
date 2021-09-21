import React from 'react'
import { Card, Table, Grid, Image } from 'semantic-ui-react'
import Moment from 'moment'

//Get List of token
const tokens = JSON.parse(localStorage.getItem('uniqueTokens'))
const contracts = JSON.parse(localStorage.getItem('uniqueAddress'))
const emptywallet = '0x0000000000000000000000000000000000000000';

var cumuGas = 0;
var cumuValue = {
  "Eth": 0
}

var poolHolding = {};
var poolInvested = [];
var poolWithdrawn = [];
var poolBookedBrofits = [];

var poolLPToken = {};
var poolLPToken = {
  "SLP": {}
};

const EtheriumLiquidityPoolsPane = ({ address }) => {
  // console.log('EtheriumLiquidityPoolsPane-Transactions', address?.etheriumliquidityPools);
  // console.log('EtheriumLiquidityPoolsPane-length', Object.keys(address?.etheriumBlocks).length);
  var i = 1;
  if (!address?.etheriumliquidityPools) return null
  return (
    <>
      <Card.Group itemsPerRow={1} stackable={true} doubling={true}>
        {Object.keys(address?.etheriumliquidityPools).map((poolname, poolindex) => (
          <Card key={poolname} className="fluid">
            <Card.Content>
              <Card.Header>
                <Grid columns='two' divided>
                  <Grid.Row>
                    <Grid.Column style={{ wordWrap: "break-word", fontWeight: "300", fontSize: "12px" }}>
                      <Grid.Row style={{ fontWeight: "1000", fontSize: "16px", marginBottom: "5px" }}>  {` ${poolindex+1}. Pool - ${poolname} ${cumuGasFee(0, 0, 1)}`} </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Header>
            </Card.Content>
            {address?.etheriumliquidityPools[poolname].map((data,index) => (
              <Card.Content key={index} extra>
                <Grid columns='two' divided>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <Grid.Row style={{ fontWeight: "600", fontSize: "16px", color: "#00b5ad" }}> {address?.etheriumBlocks[data.block].platform.tname.split('-')[1] + " Liquidity" || "Not Found"} </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "12px", color: "#000" }}> {`${Moment((address?.etheriumBlocks[data.block].transactions[0].timeStamp * 1000)).format('DD MMM YY hh:mm:ss a')}`} </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px" }}> <a href={"https://etherscan.io/tx/" + address?.etheriumBlocks[data.block].transactions[0].hash} target="_blank"> {`Block - ${data.block}`} </a> </Grid.Row>
                      {(data.reward != undefined)
                        ? <Grid.Row style={{ fontWeight: "500", fontSize: "14px", color: "#00b5ad" }}>
                          {`Earned $`}  {(address?.tokensIndexed[data.reward.tokenAddress] != undefined)
                            ? (address?.tokensIndexed[data.reward.tokenAddress].tokenInfo.price.rate * parseInt(data.reward.value) / Math.pow(10, address?.uniqueTokens[data.reward.tokenAddress].decimal)).toFixed(4) : ''} {address?.uniqueTokens[data.reward.tokenAddress].symbol}
                        </Grid.Row>
                        : <Grid.Row style={{ fontWeight: "400", fontSize: "16px", color: "#000" }}>  </Grid.Row>
                      }
                      <Grid.Row>
                        <Image src='../assets/gasfee.svg' /> &nbsp;
                        {`${parseFloat(address?.etheriumBlocks[data.block].gasFee)} Eth , Total:${cumuGasFee(parseFloat(address?.etheriumBlocks[data.block].gasFee))} Eth`}
                      </Grid.Row>
                      <hr style={{ "borderTop": "1px #f2f2f2" }}></hr>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px", marginTop: "10px" }}>
                        {`Reserve Value: $${(+address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD).toFixed(2)}`}
                      </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px", marginTop: "2px" }}>
                        {`Token Supply: ${(+address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken).toFixed(2)} ($${(poolLPTokenValue(poolname, +address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken, +address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD)["SLP"][poolname] ?? 0).toFixed(2)}/LP)`}
                      </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px", marginTop: "2px" }}>
                        {`Balance/Holding: ${(+address?.etheriumLiquidityPoolsByBlock[data.block]?.balanceLPToken).toFixed(4)} / 
                        ${(address?.etheriumBlocks[data.block].platform.tname.split('-')[1].trim() == "Add")
                            ?
                            // poolInvestedCaluate(poolname, "Add", address?.etheriumBlocks[data.block].out, address?.etheriumLiquidityPoolsByBlock[data.block]?.priceUSD) 
                            + poolCurrent(
                              poolname,
                              "Add",
                              +address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken,
                              +address?.etheriumLiquidityPoolsByBlock[data.block]?.balanceLPToken,
                              +address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD
                            )["holding"].toFixed(4)
                            : (address?.etheriumBlocks[data.block].platform.tname.split('-')[1].trim() == "Remove")
                              ?
                              // poolInvestedCaluate(poolname, "Remove", address?.etheriumBlocks[data.block].in, address?.etheriumLiquidityPoolsByBlock[data.block]?.priceUSD)
                              + poolCurrent(
                                poolname,
                                "Remove",
                                +address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken,
                                +address?.etheriumLiquidityPoolsByBlock[data.block]?.balanceLPToken,
                                +address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD
                              )["holding"].toFixed(4)
                              : poolCurrent(poolname, "None", +address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken)["holding"].toFixed(4)}`}
                      </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px", marginTop: "2px" }}>
                        {`Holding Value: $${(poolCurrent(poolname)["holding"] * (+address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD) / (+address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken)).toFixed(2)} (${poolCurrent(poolname)["percentage"].toFixed(4) + "%"})`}
                      </Grid.Row>

                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Card.Content extra>
                        {address?.etheriumBlocks[data.block].transactions.map((tr, key) => (
                          (tr.contractAddress != "") ?
                            <Grid columns='three' divided>
                              <Grid.Row>
                                <Grid.Column>
                                  <Grid.Row style={{ wordWrap: "break-word", fontWeight: "400", fontSize: "12px", marginBottom: "10px" }}>
                                    {(tr.from == address?.address) ? ' ' : (contracts[tr.from] != undefined) ? contracts[tr.from].name : (tokens[tr.from] != undefined) ? tokens[tr.from].name : "SomeWallet (" + tr.from + ")"}
                                    {(tr.to == address?.address) ? ' ' : (contracts[tr.to] != undefined) ? contracts[tr.to].name : (tokens[tr.to] != undefined) ? tokens[tr.to].name : "SomeWallet (" + tr.to + ")"}                                </Grid.Row>
                                </Grid.Column>
                                <Grid.Column>
                                  {(tr.value == 0) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC4wMDEzIDUuMzMzOThDNy4yNjc5NyA1LjMzMzk4IDYuNjc0NjQgNS45MzM5OCA2LjY3NDY0IDYuNjY3MzJMNi42Njc5NyAxNy4zMzRDNi42Njc5NyAxOC4wNjczIDcuMjYxMyAxOC42NjczIDcuOTk0NjQgMTguNjY3M0gxNi4wMDEzQzE2LjczNDYgMTguNjY3MyAxNy4zMzQ2IDE4LjA2NzMgMTcuMzM0NiAxNy4zMzRWOS4zMzM5OEwxMy4zMzQ2IDUuMzMzOThIOC4wMDEzWk05LjAwMzEyIDYuNjY3MTlDOC40NTMxMiA2LjY2NzE5IDguMDA4MTIgNy4xNDcxOSA4LjAwODEyIDcuNzMzODVMOC4wMDMxMiAxNi4yNjcyQzguMDAzMTIgMTYuODUzOSA4LjQ0ODEyIDE3LjMzMzkgOC45OTgxMyAxNy4zMzM5SDE1LjAwMzFDMTUuNTUzMSAxNy4zMzM5IDE2LjAwMzEgMTYuODUzOSAxNi4wMDMxIDE2LjI2NzJWOS44NjcxOUwxMy4wMDMxIDYuNjY3MTlIOS4wMDMxMlpNMTIuMDAzMSAxMC42Njc3VjcuMzM0MzdMMTUuMzM2NSAxMC42Njc3SDEyLjAwMzFaIiBmaWxsPSIjMkMyQzM1Ii8+CjwvZz4KPC9zdmc+Cg==' /> : (tr.to == address?.address) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K' /> : <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==' />}
                                  {(tr.value == 0) ? " Approve Transaction" : (tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(5) + ' '}
                                  {(tr.value == 0) ? " " : (tr.tokenSymbol || 'Ether ')}
                                  {(tr.value == 0) ? " " : (tr.to == address?.address) ? ' In' : ' Out'}
                                </Grid.Column>
                                <Grid.Column>
                                  {(address?.etheriumLiquidityPoolsByBlock[data.block]?.priceUSD[tr.tokenSymbol] != undefined)
                                    ? '$' + (address?.etheriumLiquidityPoolsByBlock[data.block]?.priceUSD[tr.tokenSymbol] * tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(4)
                                    + ' ($' + (+address?.etheriumLiquidityPoolsByBlock[data.block]?.priceUSD[tr.tokenSymbol]).toFixed(4) + '/' + tr.tokenSymbol + ') '
                                    : (poolLPTokenValue(poolname)[tr.tokenSymbol] != undefined)
                                      ? '$' + (poolLPTokenValue(poolname)[tr.tokenSymbol][poolname] * tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(2)
                                      : ""}
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                            : " "
                        ))}
                      </Card.Content>
                      <hr></hr>
                      <Card.Content extra>
                        <Grid columns='six' divided>
                          <Grid.Row>
                            <Grid.Column>
                              <Grid.Row>
                                {`Summary `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Token A - `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Token B - `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Total - `}
                              </Grid.Row>
                            </Grid.Column>
                            <Grid.Column>
                              <Grid.Row>
                                {`Current `}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolCurrent(poolname)["holding"] * (+address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD) / (+address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken) * 0.5).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolCurrent(poolname)["holding"] * (+address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD) / (+address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken) * 0.5).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolCurrent(poolname)["holding"] * (+address?.etheriumLiquidityPoolsByBlock[data.block]?.reserveUSD) / (+address?.etheriumLiquidityPoolsByBlock[data.block]?.supplyLPToken)).toFixed(2)}
                              </Grid.Row>
                            </Grid.Column>
                            <Grid.Column>
                              <Grid.Row>
                                {`Invested `}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolInvested[poolname] / 2).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolInvested[poolname] / 2).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolInvested[poolname]).toFixed(2)}
                              </Grid.Row>
                            </Grid.Column>
                            <Grid.Column>
                              <Grid.Row>
                                {`Withdrawn `}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolWithdrawn[poolname] / 2).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolWithdrawn[poolname] / 2).toFixed(2)}
                              </Grid.Row>
                              <Grid.Row>
                                {'$' + (poolWithdrawn[poolname]).toFixed(2)}
                              </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={4}>
                              <Grid.Row>
                                {`Inpermanent Loss : `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Paid in fees:`}
                              </Grid.Row>
                              <Grid.Row>
                                {`Realised P&L: `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Un-Realised P&L: `}
                              </Grid.Row>
                              <Grid.Row>
                                {`Net P/L :  ${(poolWithdrawn[poolname] > 0 && poolInvested[poolname] > 0) ? ((poolWithdrawn[poolname] - poolInvested[poolname]) / 2).toFixed(2) : ""}`}
                              </Grid.Row>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Card.Content>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            ))}
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
                  {`Gas Fees ${cumuGasFee(0)} Eth`}
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

function cumuGasFee(gasFee, returnable = true, reset = 0) {

  if (reset) {
    cumuGas = 0;
  }
  // console.log(gasFee);
  cumuGas += gasFee;
  if (returnable)
    return cumuGas.toFixed(4);
  else
    return ' ';
}


function poolCurrent(pool = "", action = "None", supply = 0, value = 0, valueUSD = 0) {
  // console.log("poolCurrent called", pool, action, supply, value, poolHolding);
  if (poolHolding[pool] == undefined) {
    poolHolding[pool] = {
      "supply": supply,
      "holding": value,
      "percentage": value / supply * 100,
      "added": 1,
      "removed": 0
    }
    poolInvested[pool] = +valueUSD * poolHolding[pool].percentage * 0.01;
    poolWithdrawn[pool] = 0;
    return poolHolding[pool];
  }



  if (supply > 0) {
    //update holding holding
    poolHolding[pool]["supply"] = supply;
    poolHolding[pool]["percentage"] = poolHolding[pool].holding / poolHolding[pool].supply * 100;
  }

  switch (action) {
    case "Add":
      poolInvested[pool] += +valueUSD * poolHolding[pool].holding / poolHolding[pool].supply;
      poolHolding[pool]["holding"] += value;
      poolHolding[pool]["added"]++;
      poolHolding[pool]["percentage"] = poolHolding[pool].holding / poolHolding[pool].supply * 100;


      break;
    case "Remove":
      poolWithdrawn[pool] = +valueUSD * poolHolding[pool].holding / poolHolding[pool].supply;
      poolHolding[pool]["holding"] = 0;
      poolHolding[pool]["removed"]++;
      poolHolding[pool]["percentage"] = poolHolding[pool].holding / poolHolding[pool].supply * 100;
      break;
  }
  return poolHolding[pool];
}

// function poolInvestedCaluate(pool = "", action ="None", inorout, priceUSD) {
//   console.log("poolInvestedCaluate called", pool, action, inorout, priceUSD);

//   if (poolInvested[pool] == undefined) {

//     //add quantity (totaling)
//     poolInvested[pool] = inorout;

//     //add rate
//     poolInvested[pool][0]["tokenRateUSD"] = priceUSD[poolInvested[pool][0].tokenSymbol];
//     poolInvested[pool][1]["tokenRateUSD"] = priceUSD[poolInvested[pool][1].tokenSymbol];


//     //add value to invested (totaling)
//     poolInvested[pool][0]["tokenValueUSD"] = poolInvested[pool][0]["tokenRateUSD"] * (+poolInvested[pool][0].tokenValue / Math.pow(10, +poolInvested[pool][0].tokenDecimal || 18));
//     poolInvested[pool][1]["tokenValueUSD"] = poolInvested[pool][1]["tokenRateUSD"] * (+poolInvested[pool][1].tokenValue / Math.pow(10, +poolInvested[pool][1].tokenDecimal || 18));
//   }

//   console.log("poolInvestedCaluate After Calculation", poolInvested);



// let newin = inorout;


// switch (action) {
//   case "Add":
//     //add quantity (totaling)
//     poolInvested[pool][0]["tokenValue"] = ((+poolInvested[pool][0].tokenValue) + (+newin[0].tokenValue));
//     poolInvested[pool][1]["tokenValue"] = ((+poolInvested[pool][1].tokenValue) + (+newin[1].tokenValue));

//     //temp update rate
//     newin[0]["tokenRateUSD"] = priceUSD[newin[0].tokenSymbol];
//     newin[1]["tokenRateUSD"] = priceUSD[newin[1].tokenSymbol];

//     //temp calc total value
//     newin[0]["tokenValueUSD"] = newin[0]["tokenRateUSD"] * (+newin[0].tokenValue / Math.pow(10, +newin[0].tokenDecimal || 18));
//     newin[1]["tokenValueUSD"] = newin[1]["tokenRateUSD"] * (+newin[1].tokenValue / Math.pow(10, +newin[1].tokenDecimal || 18));

//     //add value to invested (totaling)
//     poolInvested[pool][0]["tokenValueUSD"] = poolInvested[pool][0].tokenValueUSD + newin[0].tokenValueUSD;
//     poolInvested[pool][1]["tokenValueUSD"] = poolInvested[pool][1].tokenValueUSD + newin[0].tokenValueUSD;

//     //calc invested rate
//     poolInvested[pool][0]["tokenRateUSD"] = poolInvested[pool][0]["tokenValueUSD"] / poolInvested[pool][0]["tokenValue"];
//     poolInvested[pool][1]["tokenRateUSD"] = poolInvested[pool][1]["tokenValueUSD"] / poolInvested[pool][1]["tokenValue"];

//     break;

//   case "Remove":  
//     if (newin[1] == undefined)
//     return;

//     //remove quantity (totaling)
//     poolInvested[pool][0]["tokenValue"] = ((+poolInvested[pool][0].tokenValue) - (+newin[0].tokenValue));
//     poolInvested[pool][1]["tokenValue"] = ((+poolInvested[pool][1].tokenValue) - (+newin[1].tokenValue));

//     //subscract value to invested (totaling)
//     poolInvested[pool][0]["tokenValueUSD"] -= poolInvested[pool][0].tokenRateUSD * (+newin[0].tokenValue / Math.pow(10, +newin[0].tokenDecimal || 18));
//     poolInvested[pool][1]["tokenValueUSD"] -= poolInvested[pool][1].tokenRateUSD * (+newin[1].tokenValue / Math.pow(10, +newin[1].tokenDecimal || 18));

//     break;
// }

// console.log("poolInvestedCaluate After Calculation", poolInvested);

//   return " ";
// }

function poolLPTokenValue(pool = "", supply = 0, reserve = 0) {
  // console.log("poolLPTokenValue", pool, supply, reserve, poolLPToken);
  if (supply > 0 && reserve > 0) {
    poolLPToken["SLP"][pool] = reserve / supply;
  }
  return poolLPToken;
}

export default EtheriumLiquidityPoolsPane