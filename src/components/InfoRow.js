import React from 'react'
import { Grid, Header, Segment } from 'semantic-ui-react'

const colors = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black'
]

const hashCode = str => 
  str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0)

const getColor = (title) => {
  const s = (title || '').toString()
  const hash = hashCode(s)
  const color = colors[Math.abs(hash) % colors.length]
  return color
}

const InfoRow = ({ title, content, noSegment, colored, color, h }) => {
  const _color = color || colored ? getColor(title) : null
  const hSize = h || 'h4'
  return (
    <Segment color={_color}>
       <Grid verticalAlign='middle'>
      <Grid.Column width={4}>
        <Header as={hSize}>{title}</Header>
      </Grid.Column>
      <Grid.Column width={12}>
        {content}
      </Grid.Column>
    </Grid>
    </Segment>
  )
}

export default InfoRow
