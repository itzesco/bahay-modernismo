import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { floors, allGalleries, getGallery, doorsFor } from '../data.js'
import FloorPlan from '../components/FloorPlan.jsx'
import ArtImage from '../components/ArtImage.jsx'
import TourScene from '../components/TourScene.js'

const WALLS = ['front', 'right', 'back', 'left']
const WALL_ANGLE = { front: 0, right: 90, back: 180, left: 270 }
const OPPOSITE = { front: 'back', back: 'front', left: 'right', right: 'left' }
const CLICK_SLOP = 6 // px a pointer may move and still count as a click

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
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [webglError, setWebglError] = useState(false)
  const viewRef = useRef(null)
  const sceneRef = useRef(null)
  const dragRef = useRef(null)
  const timerRef = useRef(null)

  // Create the 3D renderer once.
  useEffect(() => {
    try {
      sceneRef.current = new TourScene(viewRef.current, { onReady: () => setLoading(false) })
    } catch {
      setWebglError(true)
    }
    return () => {
      clearTimeout(timerRef.current)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  // Entering a room: build it and face away from the door we came through.
  useEffect(() => {
    const from = location.state?.from
    const door = doors.find((d) => d.to === from)
    setAnimate(false)
    setYaw(door ? WALL_ANGLE[OPPOSITE[door.wall]] : 0)
    setPitch(0)
    setSelected(null)
    setFading(false)
    setLoading(true)
    sceneRef.current?.setRoom(room, hangArtworks(room.artworks, doors), doors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id])

  // Send the camera angle to the renderer.
  useEffect(() => {
    sceneRef.current?.setView(yaw, pitch, animate)
  }, [yaw, pitch, animate])

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
    setSelected(null)
    setAnimate(true)
    setYaw(turnTo(yaw, WALL_ANGLE[door.wall]))
    setFading(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => navigate(`/tour/${door.to}`, { state: { from: room.id } }), 550)
  }

  function onPointerDown(e) {
    if (e.target.closest('button, a, .vt-label')) return
    dragRef.current = { x: e.clientX, y: e.clientY, yaw, pitch, moved: false }
    setAnimate(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag) {
      // Hover: pointer cursor and highlight over paintings and doorways.
      if (e.pointerType !== 'mouse' || e.target.closest('button, a, .vt-label')) return
      const hit = sceneRef.current?.pick(e.clientX, e.clientY)
      sceneRef.current?.setHovered(hit)
      viewRef.current.style.cursor = hit ? 'pointer' : ''
      return
    }
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < CLICK_SLOP) return
    drag.moved = true
    setYaw(drag.yaw - dx * 0.25)
    setPitch(clamp(drag.pitch + dy * 0.2, -35, 35))
  }

  function onPointerUp(e) {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag || drag.moved || e.type === 'pointercancel') return
    // A tap or click without dragging: open the painting or walk through the door.
    const hit = sceneRef.current?.pick(e.clientX, e.clientY)
    if (hit?.userData.kind === 'art') setSelected(hit.userData.art)
    if (hit?.userData.kind === 'door') walk(hit.userData.door)
  }

  function openFromList(art) {
    setSelected(art)
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="vt">
      <div
        ref={viewRef}
        className={`vt-view ${fading || loading ? 'fading' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => {
          if (!dragRef.current) sceneRef.current?.setHovered(null)
        }}
      >
        {webglError && (
          <p className="vt-error">
            The 3D tour needs WebGL, which isn’t available in this browser. You can still browse the room using the
            lists below.
          </p>
        )}

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
                <button type="button" onClick={() => openFromList(art)}>
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
