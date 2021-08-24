import React from 'react'
import { Label } from 'semantic-ui-react'

const TransactionType = ({ transaction, address }) => {
  const isIn = transaction.to === address
  const color = isIn ? 'green' : 'orange'
  const text = isIn ? 'IN' : 'OUT'
  return <Label size='small' color={color}>{text}</Label>
}

export default TransactionType
