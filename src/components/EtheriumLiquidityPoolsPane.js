import React from 'react'
import { Card, Table, Grid, Image } from 'semantic-ui-react'
import Moment from 'moment'

//Get List of token
const tokens = JSON.parse(localStorage.getItem('uniqueTokens'))
const contracts = JSON.parse(localStorage.getItem('uniqueAddress'))
const emptywallet = '0x0000000000000000000000000000000000000000';

var cumuGas=0;
var cumuValue = {
  "Eth":0
}

const EtheriumLiquidityPoolsPane = ({ address }) => {
  console.log('EtheriumLiquidityPoolsPane-Transactions', address.etheriumliquidityPools);
  // console.log('EtheriumLiquidityPoolsPane-length', Object.keys(address.etheriumBlocks).length);
  var i=1;
  if (!address.etheriumliquidityPools) return null
  return (
    <>
      <Card.Group itemsPerRow={1} stackable={true} doubling={true}>
        {Object.keys(address.etheriumliquidityPools).map((poolname) => (
          <Card key={poolname} className="fluid">
            <Card.Content>
              <Card.Header>
                <Grid columns='two' divided>
                  <Grid.Row>
                    <Grid.Column style={{ wordWrap: "break-word", fontWeight: "300", fontSize: "12px"}}>
                      <Grid.Row style={{ fontWeight: "1000", fontSize: "16px", marginBottom: "5px" }}>  {`Pool - ${poolname}`} </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Header>
            </Card.Content>
            {address.etheriumliquidityPools[poolname].map((data) => (
              <Card.Content extra>
                <Grid columns='two' divided>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <Grid.Row style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px", color:"#00b5ad" }}> {address.etheriumBlocks[data.block].platform.tname.split('-')[1]+" Liquidity" || "Not Found"} </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "12px", marginBottom: "10px", color: "#000" }}> {`${Moment((address.etheriumBlocks[data.block].transactions[0].timeStamp * 1000)).format('DD MMM YY hh:mm:ss a')}`} </Grid.Row>
                      <Grid.Row style={{ fontWeight: "400", fontSize: "14px", marginBottom: "10px" }}> <a href={"https://etherscan.io/tx/" + address.etheriumBlocks[data.block].transactions[0].hash} target="_blank"> {`Block - ${data.block}`} </a> </Grid.Row>
                        {(data.reward != undefined)
                        ? <Grid.Row style={{ fontWeight: "500", fontSize: "14px", marginBottom: "10px", color: "#00b5ad" }}>
                          {`Earned $`}  {(address.tokensIndexed[data.reward.tokenAddress] != undefined)
                            ? (address.tokensIndexed[data.reward.tokenAddress].tokenInfo.price.rate * parseInt(data.reward.value) / Math.pow(10, address.uniqueTokens[data.reward.tokenAddress].decimal)).toFixed(4) : ''} {address.uniqueTokens[data.reward.tokenAddress].symbol}
                          </Grid.Row>
                          : <Grid.Row style={{ fontWeight: "400", fontSize: "16px", marginBottom: "10px", color: "#000" }}>  </Grid.Row>
                        }
                      <Grid.Row>
                        <Image src='../assets/gasfee.svg' /> &nbsp;
                        {`${cumuGasFee(parseFloat(address.etheriumBlocks[data.block].gasFee))} Eth`}
                      </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Card.Content extra>
                        {address.etheriumBlocks[data.block].transactions.map((tr, key) => (
                          (tr.contractAddress!="") ?
                          <Grid columns='three' divided>
                            <Grid.Row>
                              <Grid.Column>
                                  <Grid.Row style={{ wordWrap: "break-word", fontWeight: "400", fontSize: "12px", marginBottom: "10px"}}>
                                  {(tr.from == address.address) ? ' ' : (contracts[tr.from] != undefined) ? contracts[tr.from].name : (tokens[tr.from] != undefined) ? tokens[tr.from].name : "SomeWallet (" + tr.from + ")"}
                                  {(tr.to == address.address) ? ' ' : (contracts[tr.to] != undefined) ? contracts[tr.to].name : (tokens[tr.to] != undefined) ? tokens[tr.to].name : "SomeWallet (" + tr.to + ")"}                                </Grid.Row>
                              </Grid.Column>
                              <Grid.Column>
                                {(tr.value == 0) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC4wMDEzIDUuMzMzOThDNy4yNjc5NyA1LjMzMzk4IDYuNjc0NjQgNS45MzM5OCA2LjY3NDY0IDYuNjY3MzJMNi42Njc5NyAxNy4zMzRDNi42Njc5NyAxOC4wNjczIDcuMjYxMyAxOC42NjczIDcuOTk0NjQgMTguNjY3M0gxNi4wMDEzQzE2LjczNDYgMTguNjY3MyAxNy4zMzQ2IDE4LjA2NzMgMTcuMzM0NiAxNy4zMzRWOS4zMzM5OEwxMy4zMzQ2IDUuMzMzOThIOC4wMDEzWk05LjAwMzEyIDYuNjY3MTlDOC40NTMxMiA2LjY2NzE5IDguMDA4MTIgNy4xNDcxOSA4LjAwODEyIDcuNzMzODVMOC4wMDMxMiAxNi4yNjcyQzguMDAzMTIgMTYuODUzOSA4LjQ0ODEyIDE3LjMzMzkgOC45OTgxMyAxNy4zMzM5SDE1LjAwMzFDMTUuNTUzMSAxNy4zMzM5IDE2LjAwMzEgMTYuODUzOSAxNi4wMDMxIDE2LjI2NzJWOS44NjcxOUwxMy4wMDMxIDYuNjY3MTlIOS4wMDMxMlpNMTIuMDAzMSAxMC42Njc3VjcuMzM0MzdMMTUuMzM2NSAxMC42Njc3SDEyLjAwMzFaIiBmaWxsPSIjMkMyQzM1Ii8+CjwvZz4KPC9zdmc+Cg==' /> : (tr.to == address.address) ? <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMS4zNzc5IDcuNzU1NDRWMTQuNzM2N0w4LjMyNzg4IDExLjY4NjdDOC4wODQxMyAxMS40NDI5IDcuNjg0MTMgMTEuNDQyOSA3LjQ0MDM4IDExLjY4NjdDNy4xOTY2MyAxMS45MzA0IDcuMTk2NjMgMTIuMzI0MiA3LjQ0MDM4IDEyLjU2NzlMMTEuNTU5MSAxNi42ODY3QzExLjgwMjkgMTYuOTMwNCAxMi4xOTY2IDE2LjkzMDQgMTIuNDQwNCAxNi42ODY3TDE2LjU1OTEgMTIuNTY3OUMxNi44MDI5IDEyLjMyNDIgMTYuODAyOSAxMS45MzA0IDE2LjU1OTEgMTEuNjg2N0MxNi40NDI0IDExLjU2OTcgMTYuMjgzOCAxMS41MDM5IDE2LjExODUgMTEuNTAzOUMxNS45NTMyIDExLjUwMzkgMTUuNzk0NyAxMS41Njk3IDE1LjY3NzkgMTEuNjg2N0wxMi42Mjc5IDE0LjczNjdWNy43NTU0NEMxMi42Mjc5IDcuNDExNjkgMTIuMzQ2NiA3LjEzMDQ0IDEyLjAwMjkgNy4xMzA0NEMxMS42NTkxIDcuMTMwNDQgMTEuMzc3OSA3LjQxMTY5IDExLjM3NzkgNy43NTU0NFoiIGZpbGw9IiMwMEJFMjIiLz4KPC9nPgo8L3N2Zz4K' /> : <Image src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMjMuNSAxMkMyMy41IDE4LjM1MTMgMTguMzUxMyAyMy41IDEyIDIzLjVDNS42NDg3MyAyMy41IDAuNSAxOC4zNTEzIDAuNSAxMkMwLjUgNS42NDg3MyA1LjY0ODczIDAuNSAxMiAwLjVDMTguMzUxMyAwLjUgMjMuNSA1LjY0ODczIDIzLjUgMTJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazApIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaIiBmaWxsPSIjRjNGM0Y0Ii8+CjxwYXRoIGQ9Ik0xMi42MjIxIDE2LjI0NDZMMTIuNjIyMSA5LjI2MzMxTDE1LjY3MjEgMTIuMzEzM0MxNS45MTU5IDEyLjU1NzEgMTYuMzE1OSAxMi41NTcxIDE2LjU1OTYgMTIuMzEzM0MxNi44MDM0IDEyLjA2OTYgMTYuODAzNCAxMS42NzU4IDE2LjU1OTYgMTEuNDMyMUwxMi40NDA5IDcuMzEzMzFDMTIuMTk3MSA3LjA2OTU2IDExLjgwMzQgNy4wNjk1NiAxMS41NTk2IDcuMzEzMzFMNy40NDA4NyAxMS40MzIxQzcuMTk3MTIgMTEuNjc1OCA3LjE5NzEyIDEyLjA2OTYgNy40NDA4NyAxMi4zMTMzQzcuNTU3NjQgMTIuNDMwMyA3LjcxNjE3IDEyLjQ5NjEgNy44ODE0OSAxMi40OTYxQzguMDQ2ODIgMTIuNDk2MSA4LjIwNTM1IDEyLjQzMDMgOC4zMjIxMiAxMi4zMTMzTDExLjM3MjEgOS4yNjMzMUwxMS4zNzIxIDE2LjI0NDZDMTEuMzcyMSAxNi41ODgzIDExLjY1MzQgMTYuODY5NiAxMS45OTcxIDE2Ljg2OTZDMTIuMzQwOSAxNi44Njk2IDEyLjYyMjEgMTYuNTg4MyAxMi42MjIxIDE2LjI0NDZaIiBmaWxsPSIjMTUxNTFGIi8+CjwvZz4KPC9zdmc+Cg==' />}
                                {(tr.value == 0) ? " Approve Transaction" : (tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(5) + ' '}
                                {(tr.value == 0) ? " " : (tr.tokenSymbol || 'Ether ')}
                                {(tr.value == 0) ? " " : (tr.to == address.address) ? ' In' : ' Out'}
                              </Grid.Column>
                              <Grid.Column>
                                  {(address.tokensIndexed[tr.contractAddress] != undefined) ? '$' + (address.tokensIndexed[tr.contractAddress].tokenInfo.price.rate * tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(4) : (tr.tokenSymbol == "WETH") ? '$'+(address.ETH.price.rate*tr.value / Math.pow(10, tr.tokenDecimal || 18)).toFixed(5): ''}
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                          : " "
                        ))}
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

function cumuGasFee(gasFee,returnable=true){
  // console.log(gasFee);
  cumuGas += gasFee;
  if (returnable)
    return cumuGas.toFixed(4);
  else 
    return ' ';
}

function cumuTokenValue(tokenSymbol, tokenValue, credit=false) {
  if (cumuValue[tokenSymbol] == undefined){
    cumuValue[tokenSymbol] = 0;
  }
  
  cumuValue[tokenSymbol] = credit ? cumuValue[tokenSymbol] + tokenValue : cumuValue[tokenSymbol] - tokenValue;
  return cumuValue[tokenSymbol].toFixed(4);
}

export default EtheriumLiquidityPoolsPane