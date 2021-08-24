import React from 'react'
import { Grid, Icon, Label, Segment } from 'semantic-ui-react'

const SUCCESS_ICON = 'thumbs up outline'
const FAIL_ICON = 'thumbs down outline'
const PENDING_ICON = 'hourglass outline'

const TransactionStatus = ({receipt}) => {
  let name, label
  if (receipt) {
    name = receipt.status ? SUCCESS_ICON : FAIL_ICON
    label = receipt.status ? { color: 'green', text: 'Success' } : { color: 'red', text: 'Fail' } 
  } else {
    name = PENDING_ICON
    label = { color: 'grey', text: 'Pending' }
  }
  return (
    <Segment color={label.color}>
      <Grid verticalAlign='middle' >
        <Grid.Column>
          <Icon size='large' name={name} />
        </Grid.Column>
        <Grid.Column>
          <Label color={label.color}>{label.text}</Label>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default TransactionStatus