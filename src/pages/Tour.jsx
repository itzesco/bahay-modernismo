import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { floors, allGalleries, getGallery, doorsFor } from '../data.js'
import FloorPlan from '../components/FloorPlan.jsx'
import ArtImage from '../components/ArtImage.jsx'

const WALLS = ['front', 'right', 'back', 'left']
const WALL_ANGLE = { front: 0, right: 90, back: 180, left: 270 }
const OPPOSITE = { front: 'back', back: 'front', left: 'right', right: 'left' }

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

// Which wall the camera is facing for a given yaw angle.
function facingWall(yaw) {
  const a = (((Math.round(yaw / 90) * 90) % 360) + 360) % 360
  return WALLS.find((w) => WALL_ANGLE[w] === a)
}

// Shortest rotation from the current yaw to a target angle.
function turnTo(yaw, target) {
  return yaw + ((((target - yaw) % 360) + 540) % 360) - 180
}

// Spread artworks over the walls, filling walls without doors first.
function hangArtworks(artworks, doors) {
  const byWall = { front: [], right: [], back: [], left: [] }
  const doorWalls = new Set(doors.map((d) => d.wall))
  const order = [...WALLS.filter((w) => !doorWalls.has(w)), ...WALLS.filter((w) => doorWalls.has(w))]
  artworks.forEach((art, i) => byWall[order[i % order.length]].push(art))
  return byWall
}

export default function Tour() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const room = getGallery(roomId) || allGalleries[0]
  const floor = floors.find((f) => f.id === room.floorId)
  const doors = doorsFor(room.id)

  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [fading, setFading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [perspective, setPerspective] = useState(500)
  const viewRef = useRef(null)
  const dragRef = useRef(null)
  const timerRef = useRef(null)

  // Entering a room: face away from the door we came through.
  useEffect(() => {
    const from = location.state?.from
    const door = doors.find((d) => d.to === from)
    setAnimate(false)
    setYaw(door ? WALL_ANGLE[OPPOSITE[door.wall]] : 0)
    setPitch(0)
    setSelected(null)
    setFading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Fit the camera's field of view to the viewport size.
  useLayoutEffect(() => {
    const el = viewRef.current
    const ro = new ResizeObserver(() =>
      setPerspective(Math.max(Math.min(el.clientWidth * 0.3, el.clientHeight * 0.6), 240))
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keyboard: ← → turn, ↑ walks through the door you face, Esc closes a label.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        turn(-90)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        turn(90)
      }
      if (e.key === 'ArrowUp') {
        const door = doors.find((d) => d.wall === facingWall(yaw))
        if (door) {
          e.preventDefault()
          walk(door)
        }
      }
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function turn(deg) {
    setAnimate(true)
    setYaw((y) => Math.round((y + deg) / 90) * 90)
  }

  function walk(door) {
    if (door.exit) {
      navigate(door.href)
      return
    }
    setAnimate(true)
    setYaw(turnTo(yaw, WALL_ANGLE[door.wall]))
    setFading(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(`/tour/${door.to}`, { state: { from: room.id } }), 550)
  }

  function onPointerDown(e) {
    if (e.target.closest('button, a, .vt-label')) return
    dragRef.current = { x: e.clientX, y: e.clientY, yaw, pitch }
    setAnimate(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.x
    const dy = e.clientY - dragRef.current.y
    setYaw(dragRef.current.yaw - dx * 0.25)
    setPitch(clamp(dragRef.current.pitch + dy * 0.2, -35, 35))
  }

  function onPointerUp() {
    dragRef.current = null
  }

  const hung = hangArtworks(room.artworks, doors)

  return (
    <section className="vt">
      <div
        ref={viewRef}
        className={`vt-view ${fading ? 'fading' : ''}`}
        style={{ perspective: `${perspective}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={`vt-scene ${animate ? 'animate' : ''}`}
          style={{ transform: `translateZ(${perspective}px) rotateX(${pitch}deg) rotateY(${yaw}deg)` }}
        >
          {WALLS.map((wall) => (
            <div
              key={wall}
              className="vt-wall"
              style={{
                transform: `rotateY(${-WALL_ANGLE[wall]}deg) translateZ(-500px)`,
                '--c': room.color,
                backgroundImage: room.walls?.[wall] ? `url(${room.walls[wall]})` : undefined,
              }}
            >
              <div className="vt-wall-inner">
                {hung[wall].map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    className="vt-frame"
                    onClick={() => setSelected(art)}
                    title={`${art.title} — click for details`}
                  >
                    <ArtImage src={art.image} alt={`${art.title} by ${art.artist}`} color={room.color} label={art.title} />
                    <span className="vt-plaque">{art.title}</span>
                  </button>
                ))}
                {doors
                  .filter((d) => d.wall === wall)
                  .map((door) => (
                    <button key={door.label} type="button" className="vt-door" onClick={() => walk(door)}>
                      <span className="vt-arrow" aria-hidden="true">
                        ↑
                      </span>
                      <span className="vt-door-label">{door.label}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
          <div className="vt-floor" style={{ transform: 'rotateX(90deg) translateZ(-300px)' }} />
          <div className="vt-ceiling" style={{ transform: 'rotateX(-90deg) translateZ(-300px)' }} />
        </div>

        <div className="vt-hud-top">
          <div>
            <p className="eyebrow">
              {floor.level} · {room.number}
            </p>
            <h1>{room.title}</h1>
          </div>
          <span className="vt-compass">Facing {facingWall(yaw)} wall</span>
        </div>

        <button type="button" className="vt-turn left" onClick={() => turn(-90)} aria-label="Turn left">
          ‹
        </button>
        <button type="button" className="vt-turn right" onClick={() => turn(90)} aria-label="Turn right">
          ›
        </button>
        <p className="vt-hint">Drag to look around · click an arrow to walk to the next room · ← → to turn</p>

        {selected && (
          <div className="vt-label" role="dialog" aria-label={selected.title}>
            <button type="button" className="vt-close" onClick={() => setSelected(null)} aria-label="Close">
              ×
            </button>
            <ArtImage
              src={selected.image}
              alt={`${selected.title} by ${selected.artist}`}
              color={room.color}
              label={selected.title}
            />
            <h2>{selected.title}</h2>
            <p>
              <strong>{selected.artist}</strong>, {selected.year}
            </p>
            <p className="muted">{selected.medium}</p>
            <p>{selected.description}</p>
          </div>
        )}
      </div>

      <div className="vt-below">
        <div>
          <h2>About this room</h2>
          <p>{room.description}</p>

          <h3>In this room</h3>
          <ul className="vt-doorlist">
            {room.artworks.map((art) => (
              <li key={art.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(art)
                    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {art.title} — {art.artist}, {art.year}
                </button>
              </li>
            ))}
          </ul>

          <h3>Doorways</h3>
          <ul className="vt-doorlist">
            {doors.map((door) => (
              <li key={door.label}>
                <button type="button" onClick={() => walk(door)}>
                  {capitalize(door.wall)} wall → {door.label}
                </button>
              </li>
            ))}
          </ul>
          <Link to={`/galleries/${room.id}`}>Read the full gallery page →</Link>
        </div>
        <div>
          <h3>You are here</h3>
          <FloorPlan floor={floor} activeId={room.id} linkPrefix="/tour/" />
        </div>
      </div>
    </section>
  )
}
