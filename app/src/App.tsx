import { useState } from 'react'

import './App.css'
import MainMenu from './MainMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <MainMenu></MainMenu>
    </>
  )
}

export default App
