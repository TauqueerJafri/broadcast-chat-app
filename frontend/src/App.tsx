import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat/:roomId" element={<Chat />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
