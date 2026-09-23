import Panel from '../components/Panel'
import Timeline from '../components/Timeline'
import { education } from '../data/profile'
import { panelProps } from './looks'

export default function Education() {
  return (
    <Panel {...panelProps('education')}>
      <Timeline items={education} />
    </Panel>
  )
}
