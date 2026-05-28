import Hero from '../components/Hero'
import Stats from '../components/sections/Stats'
import ResearchAreas from '../components/sections/ResearchAreas'
import JourneyTimeline from '../components/sections/JourneyTimeline'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ResearchAreas />
      <JourneyTimeline />
      <Contact />
    </main>
  )
}
