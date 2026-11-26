import { Link } from 'react-router-dom'
import { museum, floors, exhibitions } from '../data.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Welcome to</p>
          <h1>{museum.name}</h1>
          <p className="lead">{museum.tagline}</p>
          <div className="actions">
            <Link to="/tour" className="btn">
              Start the walkthrough
            </Link>
            <Link to="/visit" className="btn ghost">
              Plan your visit
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span style={{ background: '#c8553d' }} />
          <span style={{ background: '#d9a441' }} />
          <span style={{ background: '#2d6a6a' }} />
          <span style={{ background: '#3b5b92' }} />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Explore by floor</h2>
          <Link to="/galleries">All galleries →</Link>
        </div>
        <div className="cards">
          {floors.map((f) => (
            <Link key={f.id} to={`/galleries#${f.id}`} className="card">
              <p className="eyebrow">{f.level}</p>
              <h3>{f.name}</h3>
              <p>{f.galleries.map((g) => g.number).join(' · ')}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="section-head">
          <h2>Exhibitions</h2>
          <Link to="/exhibitions">See all →</Link>
        </div>
        <div className="cards">
          {exhibitions.map((e) => (
            <div key={e.id} className="card">
              <span className={`tag ${e.status.toLowerCase()}`}>{e.status}</span>
              <h3>{e.title}</h3>
              <p className="muted">
                {e.dates} · {e.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section info-strip">
        <div>
          <h3>Hours</h3>
          {museum.hours.map((h) => (
            <p key={h.days}>
              {h.days}
              <br />
              <strong>{h.time}</strong>
            </p>
          ))}
        </div>
        <div>
          <h3>Admission</h3>
          {museum.admission.map((a) => (
            <p key={a.type}>
              {a.type}
              <br />
              <strong>{a.price}</strong>
            </p>
          ))}
        </div>
        <div>
          <h3>Location</h3>
          <p>{museum.address}</p>
        </div>
      </section>
    </>
  )
}
