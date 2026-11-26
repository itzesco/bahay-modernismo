import { Link, useParams } from 'react-router-dom'
import { floors, allGalleries, getGallery } from '../data.js'
import FloorPlan from '../components/FloorPlan.jsx'
import ArtImage from '../components/ArtImage.jsx'

export default function Gallery() {
  const { galleryId } = useParams()
  const gallery = getGallery(galleryId)

  if (!gallery) {
    return (
      <section className="section">
        <h1>Gallery not found</h1>
        <Link to="/galleries">Back to galleries</Link>
      </section>
    )
  }

  const floor = floors.find((f) => f.id === gallery.floorId)
  const index = allGalleries.findIndex((g) => g.id === gallery.id)
  const prev = allGalleries[index - 1]
  const next = allGalleries[index + 1]

  return (
    <>
      <header className="page-head gallery-head" style={{ '--c': gallery.color }}>
        <p className="eyebrow">
          {gallery.floorLevel} · {gallery.number}
        </p>
        <h1>{gallery.title}</h1>
        <p className="lead">{gallery.description}</p>
        <Link to={`/tour/${gallery.id}`} className="btn">
          Enter this room in the virtual tour
        </Link>
      </header>

      <section className="section floor-layout">
        <div className="artworks">
          {gallery.artworks.map((a) => (
            <article key={a.id} className="artwork">
              <ArtImage src={a.image} alt={`${a.title} by ${a.artist}`} color={gallery.color} label={a.title} />
              <div className="label">
                <h3>{a.title}</h3>
                <p>
                  <strong>{a.artist}</strong>, {a.year}
                </p>
                <p className="muted">{a.medium}</p>
                <p>{a.description}</p>
              </div>
            </article>
          ))}
        </div>
        <aside>
          <h3>You are here</h3>
          <FloorPlan floor={floor} activeId={gallery.id} />
        </aside>
      </section>

      <nav className="section pager" aria-label="Gallery navigation">
        {prev ? (
          <Link to={`/galleries/${prev.id}`}>
            ← {prev.number}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/galleries/${next.id}`}>
            {next.number}: {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
