// WebGL renderer for the virtual tour room.
//
// The room is a 1000 × 600 × 1000 box with the camera at its center, the same
// geometry the tour used with CSS 3D. WebGL is used because browsers draw CSS
// 3D surfaces that pass behind the camera incorrectly (black patches).
import * as THREE from 'three'

const ROOM = 1000
const WALL_H = 600
const BASEBOARD = 26
const INNER_X = 60 // side padding of the wall's hanging area
const GAP = 70 // space between items on a wall
const DOOR_W = 220
const DOOR_H = 420
const FRAME_PAD = 14
const ART_MAX_W = 340
const ART_MAX_H = 270
const PLAQUE_W = 180
const SANS = '"Inter", system-ui, sans-serif'
const DEG = Math.PI / 180
// Walls, floor and ceiling are split into a grid of small tiles. Large single
// triangles that reach behind the camera render with warped textures and
// broken depth on some GPUs; small tiles keep every angle clean.
const SEGMENTS = 24

const WALL_ROT = { front: 0, right: -90, back: 180, left: 90 } // rotation.y in degrees
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function makeCanvas(w, h, scale = 2) {
  const c = document.createElement('canvas')
  c.width = Math.round(w * scale)
  c.height = Math.round(h * scale)
  const ctx = c.getContext('2d')
  ctx.scale(scale, scale)
  return { c, ctx }
}

function canvasTexture(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Fits an image inside the frame limits, keeping its proportions.
function artSize(img) {
  if (!img) return { w: 240, h: 300 } // placeholder, 4:5
  const s = Math.min(ART_MAX_W / img.naturalWidth, ART_MAX_H / img.naturalHeight)
  return { w: Math.round(img.naturalWidth * s), h: Math.round(img.naturalHeight * s) }
}

export default class TourScene {
  constructor(container, { onReady } = {}) {
    this.container = container
    this.onReady = onReady
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x111111)
    const canvas = this.renderer.domElement
    canvas.className = 'vt-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    container.prepend(canvas)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, 1, 1, 3000)
    this.camera.rotation.order = 'YXZ'
    this.raycaster = new THREE.Raycaster()
    this.roomGroup = null
    this.clickables = []
    this.arrows = []
    this.hovered = null
    this.buildToken = 0

    this.view = { yaw: 0, pitch: 0 }
    this.tween = null

    this.resize = this.resize.bind(this)
    this.ro = new ResizeObserver(this.resize)
    this.ro.observe(container)
    this.resize()

    this.frame = this.frame.bind(this)
    this.raf = requestAnimationFrame(this.frame)
  }

  resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    // Same field of view as the original CSS perspective.
    const p = Math.max(Math.min(w * 0.3, h * 0.6), 240)
    this.camera.fov = (2 * Math.atan(h / 2 / p)) / DEG
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }

  // Point the camera. With animate, it turns smoothly over 0.5 s.
  setView(yaw, pitch, animate) {
    if (animate && !reduceMotion) {
      this.tween = { from: { ...this.view }, to: { yaw, pitch }, start: performance.now(), dur: 500 }
    } else {
      this.tween = null
      this.view = { yaw, pitch }
    }
  }

  frame(now) {
    this.raf = requestAnimationFrame(this.frame)
    if (this.tween) {
      const t = Math.min((now - this.tween.start) / this.tween.dur, 1)
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const { from, to } = this.tween
      this.view = { yaw: from.yaw + (to.yaw - from.yaw) * e, pitch: from.pitch + (to.pitch - from.pitch) * e }
      if (t === 1) this.tween = null
    }
    this.camera.rotation.y = -this.view.yaw * DEG
    this.camera.rotation.x = this.view.pitch * DEG

    // Doorway arrows bob gently; hovered frames grow slightly.
    const bob = reduceMotion ? 0 : (1 - Math.cos(((now / 1600) % 1) * Math.PI * 2)) / 2
    for (const a of this.arrows) a.position.y = a.userData.baseY + 10 * bob
    for (const obj of this.clickables) {
      const target = obj === this.hovered && obj.userData.kind === 'art' ? 1.04 : 1
      const s = obj.scale.x + (target - obj.scale.x) * 0.25
      obj.scale.set(s, s, 1)
    }
    this.renderer.render(this.scene, this.camera)
  }

  // Builds the room. Returns once everything is drawn.
  async setRoom(room, hung, doors) {
    const token = ++this.buildToken
    const allArt = Object.values(hung).flat()
    const [images] = await Promise.all([
      Promise.all(allArt.map((a) => loadImage(a.image))),
      document.fonts?.ready,
    ])
    if (token !== this.buildToken) return
    const imageById = Object.fromEntries(allArt.map((a, i) => [a.id, images[i]]))

    this.clearRoom()
    const group = new THREE.Group()
    this.roomGroup = group
    this.scene.add(group)

    for (const wall of Object.keys(WALL_ROT)) {
      const wallGroup = this.buildWall(room, hung[wall], doors.filter((d) => d.wall === wall), imageById)
      wallGroup.rotation.y = WALL_ROT[wall] * DEG
      group.add(wallGroup)
    }
    group.add(this.buildFloor(), this.buildCeiling())
    this.onReady?.()
  }

  buildWall(room, artworks, doors, imageById) {
    const g = new THREE.Group()
    const r = this.renderer

    // Lay out items in a centered row, like the original flexbox wall.
    const items = [
      ...artworks.map((art) => {
        const size = artSize(imageById[art.id])
        return { kind: 'art', art, img: imageById[art.id], ...size, w: size.w + FRAME_PAD * 2, fh: size.h + FRAME_PAD * 2 }
      }),
      ...doors.map((door) => ({ kind: 'door', door, w: DOOR_W })),
    ]
    const total = items.reduce((s, it) => s + it.w, 0) + GAP * Math.max(items.length - 1, 0)
    const innerW = ROOM - INNER_X * 2
    const innerH = WALL_H - BASEBOARD
    let x = INNER_X + (innerW - total) / 2
    for (const it of items) {
      it.x = x
      x += it.w + GAP
      if (it.kind === 'art') it.y = innerH / 2 - 20 - it.fh / 2
      else it.y = innerH - DOOR_H
    }

    // Plaque texts, measured before drawing the wall so shadows line up.
    const { ctx: measure } = makeCanvas(1, 1, 1)
    measure.font = `600 13px ${SANS}`
    for (const it of items) {
      if (it.kind !== 'art') continue
      it.plaqueLines = wrapText(measure, it.art.title, PLAQUE_W - 16)
      it.plaqueH = Math.ceil(it.plaqueLines.length * 13 * 1.3 + 12)
      it.plaqueY = it.y + it.fh + 14
    }

    // Wall surface: paint, soft edge shading, baseboard, and cast shadows.
    const { c, ctx } = makeCanvas(ROOM, WALL_H, 1.5)
    ctx.fillStyle = '#efe9de'
    ctx.fillRect(0, 0, ROOM, WALL_H)
    const edge = (x0, y0, x1, y1) => {
      const grad = ctx.createLinearGradient(x0, y0, x1, y1)
      grad.addColorStop(0, 'rgba(0,0,0,0.11)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, ROOM, WALL_H)
    }
    edge(0, 0, 0, 120)
    edge(0, WALL_H, 0, WALL_H - 120)
    edge(0, 0, 120, 0)
    edge(ROOM, 0, ROOM - 120, 0)
    for (const it of items) {
      ctx.save()
      if (it.kind === 'art') {
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.shadowBlur = 30
        ctx.shadowOffsetY = 18
        ctx.fillStyle = '#2a241e'
        ctx.fillRect(it.x + 2, it.y + 2, it.w - 4, it.fh - 4)
        ctx.shadowColor = 'rgba(0,0,0,0.2)'
        ctx.shadowBlur = 6
        ctx.shadowOffsetY = 2
        ctx.fillStyle = '#fff'
        ctx.fillRect(it.x + it.w / 2 - PLAQUE_W / 2 + 1, it.plaqueY + 1, PLAQUE_W - 2, it.plaqueH - 2)
      }
      ctx.restore()
    }
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillRect(0, WALL_H - BASEBOARD - 4, ROOM, BASEBOARD + 4)
    ctx.fillStyle = room.color
    ctx.fillRect(0, WALL_H - BASEBOARD, ROOM, BASEBOARD)

    const wallMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM, WALL_H, SEGMENTS, SEGMENTS),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c, r) })
    )
    wallMesh.position.z = -ROOM / 2
    g.add(wallMesh)

    // Converts wall pixel coordinates (top-left origin) to 3D positions.
    const at = (px, py, w, h, z) => new THREE.Vector3(px + w / 2 - ROOM / 2, WALL_H / 2 - (py + h / 2), -ROOM / 2 + z)

    for (const it of items) {
      if (it.kind === 'art') g.add(this.buildFrame(it, room, at))
      else g.add(this.buildDoor(it, at))
    }
    return g
  }

  buildFrame(it, room, at) {
    const r = this.renderer
    const frame = new THREE.Group()
    frame.position.copy(at(it.x, it.y, it.w, it.fh, 2))
    frame.userData = { kind: 'art', art: it.art }

    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(it.w, it.fh),
      new THREE.MeshBasicMaterial({ color: '#2a241e' })
    )
    frame.add(back)

    let tex
    if (it.img) {
      tex = new THREE.Texture(it.img)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = r.capabilities.getMaxAnisotropy()
      tex.needsUpdate = true
    } else {
      const { c, ctx } = makeCanvas(it.w - FRAME_PAD * 2, it.fh - FRAME_PAD * 2)
      const w = it.w - FRAME_PAD * 2
      const h = it.fh - FRAME_PAD * 2
      ctx.fillStyle = room.color
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      for (let s = -h; s < w; s += 28) {
        ctx.beginPath()
        ctx.moveTo(s, h)
        ctx.lineTo(s + 14, h)
        ctx.lineTo(s + 14 + h, 0)
        ctx.lineTo(s + h, 0)
        ctx.fill()
      }
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.font = `14px ${SANS}`
      const tw = Math.min(ctx.measureText(it.art.title).width + 22, w - 10)
      ctx.fillRect(w / 2 - tw / 2, h / 2 - 14, tw, 28)
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(it.art.title, w / 2, h / 2, w - 20)
      tex = canvasTexture(c, r)
    }
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(it.w - FRAME_PAD * 2, it.fh - FRAME_PAD * 2),
      new THREE.MeshBasicMaterial({ map: tex })
    )
    art.position.z = 0.5
    frame.add(art)

    // Plaque under the frame.
    const { c, ctx } = makeCanvas(PLAQUE_W, it.plaqueH, 3)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, PLAQUE_W, it.plaqueH)
    ctx.fillStyle = '#1d1b18'
    ctx.font = `600 13px ${SANS}`
    ctx.textBaseline = 'top'
    it.plaqueLines.forEach((line, i) => ctx.fillText(line, 8, 6 + i * 13 * 1.3 + 1))
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(PLAQUE_W, it.plaqueH),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c, r) })
    )
    plaque.position.y = -(it.fh / 2 + 14 + it.plaqueH / 2)
    plaque.position.z = 0.5
    frame.add(plaque)

    this.clickables.push(frame)
    return frame
  }

  buildDoor(it, at) {
    const r = this.renderer
    const door = new THREE.Group()
    door.position.copy(at(it.x, it.y, DOOR_W, DOOR_H, 2))
    door.userData = { kind: 'door', door: it.door }

    // Door panel with its label.
    const { c, ctx } = makeCanvas(DOOR_W, DOOR_H)
    const grad = ctx.createLinearGradient(0, 0, 0, DOOR_H)
    grad.addColorStop(0, '#1b1915')
    grad.addColorStop(1, '#3a332a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, DOOR_W, DOOR_H)
    ctx.strokeStyle = '#d9cfbf'
    ctx.lineWidth = 20
    ctx.strokeRect(0, 0, DOOR_W, DOOR_H)
    ctx.font = `600 16px ${SANS}`
    const lines = wrapText(ctx, it.door.label, DOOR_W - 32)
    const lineH = 20
    const block = 84 + 14 + lines.length * lineH
    const top = (DOOR_H - block) / 2
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    lines.forEach((line, i) => ctx.fillText(line, DOOR_W / 2, top + 84 + 14 + lineH * i + lineH / 2))
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(DOOR_W, DOOR_H),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c, r) })
    )
    door.add(panel)

    // Round arrow button; swaps to the accent color on hover.
    const arrowTex = (bg, fg) => {
      const { c, ctx } = makeCanvas(84, 84, 3)
      ctx.fillStyle = bg
      ctx.beginPath()
      ctx.arc(42, 42, 42, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = fg
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(42, 62)
      ctx.lineTo(42, 24)
      ctx.moveTo(27, 38)
      ctx.lineTo(42, 23)
      ctx.lineTo(57, 38)
      ctx.stroke()
      return canvasTexture(c, r)
    }
    const normal = arrowTex('rgba(255,255,255,0.92)', '#1d1b18')
    const hover = arrowTex('#c8553d', '#fff')
    const arrow = new THREE.Mesh(
      new THREE.PlaneGeometry(84, 84),
      new THREE.MeshBasicMaterial({ map: normal, transparent: true })
    )
    arrow.position.set(0, DOOR_H / 2 - top - 42, 0.5)
    arrow.userData = { baseY: arrow.position.y, normal, hover }
    door.add(arrow)
    door.userData.arrow = arrow

    this.arrows.push(arrow)
    this.clickables.push(door)
    return door
  }

  buildFloor() {
    const { c, ctx } = makeCanvas(ROOM, ROOM, 1)
    for (let x = 0; x < ROOM; x += 100) {
      ctx.fillStyle = '#6d4c33'
      ctx.fillRect(x, 0, 98, ROOM)
      ctx.fillStyle = '#5a3e2a'
      ctx.fillRect(x + 98, 0, 2, ROOM)
    }
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM, ROOM, SEGMENTS, SEGMENTS),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c, this.renderer) })
    )
    floor.rotation.x = -90 * DEG
    floor.position.y = -WALL_H / 2
    return floor
  }

  buildCeiling() {
    const { c, ctx } = makeCanvas(ROOM, ROOM, 1)
    ctx.fillStyle = '#f7f4ee'
    ctx.fillRect(0, 0, ROOM, ROOM)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(ROOM / 2, ROOM / 2, 60, 0, Math.PI * 2)
    ctx.fill()
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM, ROOM, SEGMENTS, SEGMENTS),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c, this.renderer) })
    )
    ceiling.rotation.x = 90 * DEG
    ceiling.position.y = WALL_H / 2
    return ceiling
  }

  // What is under a screen point: { kind: 'art', art } | { kind: 'door', door } | null
  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    this.raycaster.setFromCamera(ndc, this.camera)
    const hits = this.raycaster.intersectObjects(this.clickables, true)
    let obj = hits[0]?.object
    while (obj && !obj.userData.kind) obj = obj.parent
    return obj || null
  }

  setHovered(obj) {
    if (this.hovered === obj) return
    const prevArrow = this.hovered?.userData.arrow
    if (prevArrow) prevArrow.material.map = prevArrow.userData.normal
    this.hovered = obj
    const arrow = obj?.userData.arrow
    if (arrow) arrow.material.map = arrow.userData.hover
  }

  clearRoom() {
    if (!this.roomGroup) return
    this.scene.remove(this.roomGroup)
    this.roomGroup.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        o.material.map?.dispose()
        o.material.dispose()
      }
      if (o.userData.normal) o.userData.normal.dispose()
      if (o.userData.hover) o.userData.hover.dispose()
    })
    this.roomGroup = null
    this.clickables = []
    this.arrows = []
    this.hovered = null
  }

  dispose() {
    this.buildToken++
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.clearRoom()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
