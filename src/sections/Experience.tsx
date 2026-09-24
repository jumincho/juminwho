import Panel from '../components/Panel'
import Timeline from '../components/Timeline'
import { experience } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import { panelProps } from './looks'

export default function Experience() {
  const { t } = useLanguage()
  return (
    <Panel {...panelProps('experience', t)}>
      <Timeline items={experience} />
    </Panel>
  )
}
