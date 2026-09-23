import type { ComponentProps } from 'react'

/** A link that opens in a new tab without handing the new page a window reference. */
export default function ExternalLink(props: ComponentProps<'a'>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}
