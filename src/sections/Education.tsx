import Panel from '../components/Panel'
import Timeline from '../components/Timeline'
import { education } from '../data/profile'
import { useLanguage } from '../hooks/useLanguage'
import { panelProps } from './looks'

export default function Education() {
  const { t } = useLanguage()
  return (
    <Panel {...panelProps('education', t)}>
      <Timeline items={education} />
    </Panel>
  )
}
