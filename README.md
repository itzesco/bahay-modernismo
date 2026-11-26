# Bahay Modernismo

A website for **Bahay Modernismo — a house of Filipino modern art and design**: home page, visitor
info, an interactive floor guide, a page for each gallery, exhibitions, an about page, and a 3D
virtual walkthrough of all eight galleries.

Built with [React](https://react.dev), [Vite](https://vite.dev) and
[React Router](https://reactrouter.com). The virtual tour is drawn with
[three.js](https://threejs.org) (WebGL), so walls render cleanly from every angle. The site is fully
responsive (phones, tablets and laptops).

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

> Opening `index.html` directly, or through VS Code Live Server, won't work. Use `npm run dev`.

## Build for production

```bash
npm run build
```

The finished site is written to `dist/`. Because the site uses hash URLs (`/#/tour`) and relative
asset paths, `dist/` works on any static host (Vercel, Netlify, GitHub Pages) with no extra
configuration. On Vercel, import the repository and keep the defaults (framework: Vite).

## Pages

| URL | Page |
| --- | --- |
| `#/` | Home |
| `#/visit` | Hours, admission, guidelines, directory, map |
| `#/galleries` | Floor guide with clickable floor plans |
| `#/galleries/g1` … `g8` | Individual gallery with its artworks |
| `#/tour` · `#/tour/g1` … `g8` | 3D virtual tour |
| `#/exhibitions` | Exhibitions |
| `#/about` | About the museum |

### Virtual tour controls

- **Drag** (mouse or finger) to look around.
- **‹ ›** buttons or **← →** keys turn 90°.
- Click a **doorway arrow** (or press **↑** while facing it) to walk to the next room.
- Click or tap a **painting** to open its label; **×** or **Esc** closes it.
- Below the viewer, “In this room” and “Doorways” lists give the same actions as plain buttons.

## Editing content

All text and data is in **`src/data.js`**: museum name, hours, admission, contact, guidelines,
floors, galleries, artworks and exhibitions. Styling is in **`src/index.css`**: the colors and fonts
are the CSS variables at the top of the file. The 3D room (walls, floor, frames, doorways) is drawn
in **`src/components/TourScene.js`**.

To change an artwork, put the image in `public/art/` and update its entry in `src/data.js`:

```js
artwork('a1', 'Title', 'Artist', 'Year', 'Medium', 'file-name.jpg', 'Label text…')
```

If you leave an artwork without an image, a striped placeholder in the gallery's color is shown.

## Placeholder artworks

The galleries currently use famous public-domain paintings as placeholders, so the tour looks
complete. Replace them with the museum's own collection when it is ready. Images come from
[Wikimedia Commons](https://commons.wikimedia.org):

| Gallery | Paintings |
| --- | --- |
| I · Orientation Hall | Juan Luna, *Spoliarium*; Félix Resurrección Hidalgo, *Las Vírgenes Cristianas Expuestas al Populacho* |
| II · The House Itself | Leonardo da Vinci, *Mona Lisa*; Johannes Vermeer, *Girl with a Pearl Earring*; Diego Velázquez, *Las Meninas* |
| III · Archive Room | Rembrandt, *The Night Watch*; Sandro Botticelli, *The Birth of Venus* |
| IV · Early Moderns | Claude Monet, *Impression, Sunrise*; Georges Seurat, *A Sunday on La Grande Jatte*; John Constable, *The Hay Wain* |
| V · Abstraction | Wassily Kandinsky, *Composition VII*; Gustav Klimt, *The Kiss* |
| VI · Sculpture Court | Edvard Munch, *The Scream*; Caspar David Friedrich, *Wanderer above the Sea of Fog* |
| VII · Modern Living | Vincent van Gogh, *The Starry Night*; Vincent van Gogh, *Café Terrace at Night* |
| VIII · Temporary Exhibitions | Katsushika Hokusai, *The Great Wave off Kanagawa* |
