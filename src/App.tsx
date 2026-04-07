import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useProgress }    from './hooks/useProgress'
import { Splash }         from './pages/Splash'
import { Home }           from './pages/Home'
import { LetterPage }     from './pages/Letter'
import { VocabularyPage } from './pages/Vocabulary'
import { TracingPage }    from './pages/Tracing'
import { GamePage }       from './pages/Game'
import { RewardsPage }    from './pages/Rewards'
import { useState }       from 'react'

function AppRoutes() {
  const { hasProfile } = useProgress()
  const [profileReady, setProfileReady] = useState(hasProfile)

  if (!profileReady) {
    return <Splash onComplete={() => setProfileReady(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/letter/:id"        element={<LetterPage />} />
        <Route path="/vocabulary/:id"    element={<VocabularyPage />} />
        <Route path="/tracing/:id"       element={<TracingPage />} />
        <Route path="/game/:id"          element={<GamePage />} />
        <Route path="/rewards"           element={<RewardsPage />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return <AppRoutes />
}
