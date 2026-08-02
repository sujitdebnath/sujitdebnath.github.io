import Intro from '../sections/Intro.jsx'
import Quote from '../sections/Quote.jsx'
import Experience from '../sections/Experience.jsx'
import Education from '../sections/Education.jsx'
import Research from '../sections/Research.jsx'
import Projects from '../sections/Projects.jsx'
import LatestEntries from '../sections/LatestEntries.jsx'
import CoffeeChat from '../sections/CoffeeChat.jsx'

export default function Home() {
  return (
    <>
      <Intro />
      <Quote />
      <Experience />
      <Education />
      <Research />
      <Projects />
      <LatestEntries />
      <CoffeeChat />
    </>
  )
}
