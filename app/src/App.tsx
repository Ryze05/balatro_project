import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Game from './pages/Game/Game'
import NotFound from './pages/NotFound/NotFound'
import RotatePrompt from './components/RotatePrompt/RotatePrompt'

function App() {

  return (
    <>
      <RotatePrompt />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
