import { Link } from 'react-router-dom'
import { museum, floors } from '../data.js'

export default function Visit() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Plan your visit</p>
        <h1>Visit {museum.name}</h1>
      </header>

      <section className="section grid-2">
        <div className="panel">
          <h2>Hours</h2>
          <table className="table">
            <tbody>
              {museum.hours.map((h) => (
                <tr key={h.days}>
                  <td>{h.days}</td>
                  <td>{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">{museum.lastEntry}</p>
        </div>
        <div className="panel">
          <h2>Admission</h2>
          <table className="table">
            <tbody>
              {museum.admission.map((a) => (
                <tr key={a.type}>
                  <td>{a.type}</td>
                  <td>{a.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Visitor guidelines</h2>
        <ol className="guidelines">
          {museum.guidelines.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ol>
      </section>

      <section className="section alt">
        <h2>Museum directory</h2>
        <div className="directory">
          {[...floors].reverse().map((f) => (
            <div key={f.id} className="dir-row">
              <div className="dir-floor">
                <strong>{f.level}</strong>
                <span className="muted">{f.name}</span>
              </div>
              <div className="dir-galleries">
                {f.galleries.map((g) => (
                  <Link key={g.id} to={`/galleries/${g.id}`} style={{ '--c': g.color }}>
                    {g.number} — {g.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Getting here</h2>
        <p>{museum.address}</p>
        <div className="map-placeholder">Map embed goes here</div>
        <p className="muted">
          Contact: <a href={`mailto:${museum.email}`}>{museum.email}</a> ·{' '}
          <a href={`tel:${museum.phone.replace(/\s/g, '')}`}>{museum.phone}</a>
        </p>
      </section>
    </>
  )
}
