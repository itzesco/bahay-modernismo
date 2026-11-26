import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Visit from './pages/Visit.jsx'
import Galleries from './pages/Galleries.jsx'
import Gallery from './pages/Gallery.jsx'
import Exhibitions from './pages/Exhibitions.jsx'
import About from './pages/About.jsx'

// The tour loads its 3D engine only when someone opens it.
const Tour = lazy(() => import('./pages/Tour.jsx'))
const tour = (
  <Suspense fallback={<section className="vt"><div className="vt-view" /></section>}>
    <Tour />
  </Suspense>
)

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
          <Route path="tour" element={tour} />
          <Route path="tour/:roomId" element={tour} />
          <Route path="exhibitions" element={<Exhibitions />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
