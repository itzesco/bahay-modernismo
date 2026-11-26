import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { floors } from '../data.js'
import FloorPlan from '../components/FloorPlan.jsx'

const floorFromHash = (hash) => floors.find((f) => `#${f.id}` === hash)?.id || floors[0].id

export default function Galleries() {
  const { hash } = useLocation()
  const [floorId, setFloorId] = useState(() => floorFromHash(hash))

  // Follow links like /galleries#second even when already on this page.
  useEffect(() => {
    if (hash) setFloorId(floorFromHash(hash))
  }, [hash])

  const floor = floors.find((f) => f.id === floorId)

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Galleries</p>
        <h1>Floor guide</h1>
        <p className="lead">Choose a floor, then select a room on the plan to enter that gallery.</p>
      </header>

      <section className="section">
        <div className="tabs" role="tablist" aria-label="Floors">
          {floors.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === floorId}
              className={f.id === floorId ? 'tab active' : 'tab'}
              onClick={() => setFloorId(f.id)}
            >
              {f.level}
            </button>
          ))}
        </div>

        <div className="floor-layout">
          <div>
            <h2>
              {floor.level}: {floor.name}
            </h2>
            <FloorPlan floor={floor} />
          </div>
          <ul className="gallery-list">
            {floor.galleries.map((g) => (
              <li key={g.id} style={{ '--c': g.color }}>
                <Link to={`/galleries/${g.id}`}>
                  <span className="eyebrow">
                    {g.number} · {g.theme}
                  </span>
                  <strong>{g.title}</strong>
                  <span className="muted">{g.artworks.length} works</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
