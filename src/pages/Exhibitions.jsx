import { exhibitions } from '../data.js'

export default function Exhibitions() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">What's on</p>
        <h1>Exhibitions</h1>
      </header>
      <section className="section">
        <div className="exhibit-list">
          {exhibitions.map((e) => (
            <article key={e.id} className="exhibit">
              <span className={`tag ${e.status.toLowerCase()}`}>{e.status}</span>
              <h2>{e.title}</h2>
              <p className="muted">
                {e.dates} · {e.location}
              </p>
              <p>{e.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
