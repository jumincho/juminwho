import { Award, BookOpen, Briefcase, GraduationCap, type LucideIcon } from 'lucide-react'
import type { Tone } from '../components/Panel'
import { sections, type SectionKey } from '../data/profile'

/** Icon and pastel tone of each section, shared by its panel and its nav link. */
export const sectionLooks: Record<SectionKey, { icon: LucideIcon; tone: Tone }> = {
  publications: { icon: BookOpen, tone: 'sage' },
  experience: { icon: Briefcase, tone: 'peach' },
  education: { icon: GraduationCap, tone: 'sky' },
  honors: { icon: Award, tone: 'butter' },
}

/** Everything a <Panel> needs for the given section. */
export function panelProps(key: SectionKey) {
  const { id, title } = sections[key]
  return { id, title, ...sectionLooks[key] }
}
