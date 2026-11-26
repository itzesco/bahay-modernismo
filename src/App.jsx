import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Visit from './pages/Visit.jsx'
import Galleries from './pages/Galleries.jsx'
import Gallery from './pages/Gallery.jsx'
import Tour from './pages/Tour.jsx'
import Exhibitions from './pages/Exhibitions.jsx'
import About from './pages/About.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="visit" element={<Visit />} />
          <Route path="galleries" element={<Galleries />} />
          <Route path="galleries/:galleryId" element={<Gallery />} />
          <Route path="tour" element={<Tour />} />
          <Route path="tour/:roomId" element={<Tour />} />
          <Route path="exhibitions" element={<Exhibitions />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
