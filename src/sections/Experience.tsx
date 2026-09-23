import Panel from '../components/Panel'
import Timeline from '../components/Timeline'
import { experience } from '../data/profile'
import { panelProps } from './looks'

export default function Experience() {
  return (
    <Panel {...panelProps('experience')}>
      <Timeline items={experience} />
    </Panel>
  )
}
