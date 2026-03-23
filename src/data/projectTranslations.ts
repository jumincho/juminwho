export type ProjectLocale = 'ko' | 'en'

export interface LocalizedProjectImageTranslation {
  src?: string
  caption?: string
}

export interface LocalizedProjectSectionTranslation {
  heading?: string
  body?: string
  html?: string
  images?: LocalizedProjectImageTranslation[]
}

export interface LocalizedProjectTranslation {
  subtitle?: string
  description?: string
  paper?: string
  paperTitle?: string
  sections?: LocalizedProjectSectionTranslation[]
}

export const projectTitleEnglishGlossary: Record<string, string> = {}

export const projectTranslations: Record<string, Partial<Record<ProjectLocale, LocalizedProjectTranslation>>> = {
  'research-template': {
    ko: {
      subtitle: '세부 내용은 추후 작성 예정입니다.',
      description: '대표 연구 프로젝트를 위한 자리입니다. 배경, 방법, 결과는 추후 작성 예정입니다.',
      sections: [
        {
          heading: '개요',
          body: '문제 정의, 연구 동기, 프로젝트 범위는 추후 작성 예정입니다.',
        },
        {
          heading: '방법',
          body: '핵심 아이디어, 데이터셋, 구현 세부 내용과 실험 설정은 추후 작성 예정입니다.',
        },
        {
          heading: '결과',
          body: '결과, 그림, 논문 링크와 후속 계획은 추후 작성 예정입니다.',
        },
      ],
    },
    en: {
      subtitle: 'Details will be added later',
      description: 'This slot is reserved for a representative research project. Background, method, and results will be added later.',
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
    },
  },
  'application-template': {
    ko: {
      subtitle: '활용 사례와 구현 내용은 추후 작성 예정입니다.',
      description: '실전형 엔지니어링 또는 제품 프로젝트를 위한 자리입니다. 사용자 문제, 구현 방식, 임팩트는 추후 작성 예정입니다.',
      sections: [
        {
          heading: '사용자 문제',
          body: '대상 사용자, 사용 시나리오, 요구사항은 추후 작성 예정입니다.',
        },
        {
          heading: '구현',
          body: '아키텍처, 설계 결정, 개발 과정은 추후 작성 예정입니다.',
        },
        {
          heading: '성과',
          body: '데모 링크, 스크린샷, 지표, 회고는 추후 작성 예정입니다.',
        },
      ],
    },
    en: {
      subtitle: 'Case study and product details will be added later',
      description: 'Use this slot for a practical engineering or product project. User problem, implementation, and impact will be added later.',
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
    },
  },
  'archive-template': {
    ko: {
      subtitle: '향후 업데이트를 위한 포트폴리오 자리입니다.',
      description: '사이드 프로젝트, 협업, 출판물 요약 등 원하는 항목으로 재사용할 수 있는 placeholder 카드입니다.',
      sections: [
        {
          heading: '무엇을 담을지',
          body: '프로젝트 또는 출판물 요약은 추후 작성 예정입니다.',
        },
        {
          heading: '무엇을 했는지',
          body: '과정, 기술 기여, 담당 역할은 추후 작성 예정입니다.',
        },
        {
          heading: '다음 단계',
          body: '개선 계획, 링크, 보조 자료는 추후 작성 예정입니다.',
        },
      ],
    },
    en: {
      subtitle: 'Portfolio entry reserved for future updates',
      description: 'This placeholder can be reused for a side project, collaboration, publication summary, or anything else you want to feature later.',
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
    },
  },
}
