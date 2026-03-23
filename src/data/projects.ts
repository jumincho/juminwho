export interface ProjectImage {
  src: string
  caption: string
}

export interface ProjectSection {
  heading: string
  body: string
  images?: ProjectImage[]
  html?: string
}

export interface Project {
  slug: string
  title: string
  subtitle?: string
  description: string
  tags: string[]
  category: string
  github?: string
  demo?: string
  paper?: string
  paperUrl?: string
  paperTitle?: string
  thumbnail?: string
  sections: ProjectSection[]
  techStack?: string[]
}

export const projects: Project[] = [
  {
    slug: 'research-template',
    title: 'Research Project Template',
    subtitle: 'Details will be added later',
    description: 'This card is reserved for a representative research project. Background, method, and results will be added later.',
    tags: ['Research', 'Coming Soon'],
    category: 'Research',
    sections: [
      {
        heading: 'Overview',
        body: 'Problem definition, motivation, and project scope will be added later.',
      },
      {
        heading: 'Method',
        body: 'Core ideas, datasets, implementation details, and experiment setup will be added later.',
      },
      {
        heading: 'Outcome',
        body: 'Results, figures, publication links, and follow-up plans will be added later.',
      },
    ],
    techStack: ['TBD'],
  },
  {
    slug: 'application-template',
    title: 'Applied Project Template',
    subtitle: 'Case study and product details will be added later',
    description: 'Use this slot for a practical engineering or product project. User problem, implementation, and impact will be added later.',
    tags: ['Applied AI', 'Coming Soon'],
    category: 'Applied AI',
    sections: [
      {
        heading: 'User Problem',
        body: 'Target users, use case, and requirements will be added later.',
      },
      {
        heading: 'Implementation',
        body: 'Architecture, system design choices, and development notes will be added later.',
      },
      {
        heading: 'Impact',
        body: 'Demo links, screenshots, metrics, and lessons learned will be added later.',
      },
    ],
    techStack: ['TBD'],
  },
  {
    slug: 'archive-template',
    title: 'Archive Template',
    subtitle: 'Portfolio entry reserved for future updates',
    description: 'This placeholder can be reused for a side project, collaboration, publication summary, or anything else you want to feature later.',
    tags: ['Portfolio', 'Placeholder'],
    category: 'Archive',
    sections: [
      {
        heading: 'What This Is',
        body: 'A short summary of the project or publication will be added later.',
      },
      {
        heading: 'What Was Done',
        body: 'Process notes, technical contributions, and responsibilities will be added later.',
      },
      {
        heading: 'What Comes Next',
        body: 'Planned improvements, links, and supporting materials will be added later.',
      },
    ],
    techStack: ['TBD'],
  },
]
