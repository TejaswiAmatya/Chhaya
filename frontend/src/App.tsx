import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Feed } from './pages/Feed'
import { SOSButton } from './components/ui/SOSButton'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/sahara" element={<div className="min-h-screen bg-pageBg" />} />
      </Routes>
      <SOSButton />
    </BrowserRouter>
  )
}
