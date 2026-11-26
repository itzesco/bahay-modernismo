import { Link } from 'react-router-dom'

export default function FloorPlan({ floor, activeId, linkPrefix = '/galleries/' }) {
  return (
    <div className="floorplan" aria-label={`${floor.level} floor plan`}>
      {floor.galleries.map((g) => {
        const [col, row, colSpan, rowSpan] = g.grid
        return (
          <Link
            key={g.id}
            to={`${linkPrefix}${g.id}`}
            className={g.id === activeId ? 'room active' : 'room'}
            aria-current={g.id === activeId ? 'location' : undefined}
            style={{
              gridColumn: `${col} / span ${colSpan}`,
              gridRow: `${row} / span ${rowSpan}`,
              '--c': g.color,
            }}
          >
            <span className="room-num">{g.number}</span>
            <span className="room-title">{g.title}</span>
          </Link>
        )
      })}
    </div>
  )
}
