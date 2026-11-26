import { museum } from '../data.js'

export default function About() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1>About The Museum {museum.name}</h1>
        <p className="lead">{museum.intro}</p>
      </header>
      <section className="section grid-2">
        <div>
          <h2>History</h2>
          <p>Placeholder. The story of the house and how it became a museum.</p>
        </div>
        <div>
          <h2>Mission</h2>
          <p>Placeholder. What the museum preserves, studies, and shares with the public.</p>
        </div>
        <div>
          <h2>The collection</h2>
          <p>Placeholder. An overview of the collection's scope and highlights.</p>
        </div>
        <div>
          <h2>Contact</h2>
          <p>
            {museum.address}
            <br />
            <a href={`mailto:${museum.email}`}>{museum.email}</a>
            <br />
            <a href={`tel:${museum.phone.replace(/\s/g, '')}`}>{museum.phone}</a>
          </p>
        </div>
      </section>
    </>
  )
}
