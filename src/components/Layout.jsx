import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { museum } from '../data.js'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/visit', label: 'Visit' },
  { to: '/galleries', label: 'Galleries' },
  { to: '/tour', label: 'Virtual Tour' },
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/about', label: 'About' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <div className="topbar">
        <span>
          Open {museum.hours[0].days}, {museum.hours[0].time}
        </span>
        <span>Admission: {museum.admission[0].price}</span>
      </div>

      <header className="header">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true" />
          <span>{museum.name}</span>
        </Link>
        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="site-nav" className={open ? 'nav open' : 'nav'}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={close}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <strong>{museum.name}</strong>
          <p>{museum.address}</p>
        </div>
        <div>
          <strong>Hours</strong>
          {museum.hours.map((h) => (
            <p key={h.days}>
              {h.days}: {h.time}
            </p>
          ))}
        </div>
        <div>
          <strong>Contact</strong>
          <p>
            <a href={`mailto:${museum.email}`}>{museum.email}</a>
          </p>
          <p>
            <a href={`tel:${museum.phone.replace(/\s/g, '')}`}>{museum.phone}</a>
          </p>
        </div>
      </footer>
    </>
  )
}
