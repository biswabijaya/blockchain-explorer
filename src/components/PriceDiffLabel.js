import React from 'react'
import { Label } from 'semantic-ui-react'

const PriceDiffLabel = ({ diff, label }) => {
  if (!diff) return null
  return (
    <Label
      color={diff > 0 ? 'green' : 'red'}
    >{`${label} ${diff.toFixed(2)}%`}</Label>
  )
}

export default PriceDiffLabel