// All museum content lives here. Edit this file to change text, galleries,
// artworks, exhibitions, hours, or contact details.

// Builds a URL to a file in /public that works on any host or sub-path.
const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export const museum = {
  name: 'Bahay Modernismo',
  tagline: 'A house of Filipino modern art and design',
  intro:
    'Placeholder introduction. Describe the museum, its founding, and what visitors will discover as they walk through its galleries.',
  address: 'Street address, City, Metro Manila, Philippines',
  email: 'info@example.com',
  phone: '+63 2 0000 0000',
  hours: [
    { days: 'Tuesday – Sunday', time: '9:00 AM – 6:00 PM' },
    { days: 'Monday', time: 'Closed' },
  ],
  lastEntry: 'Last admission at 5:00 PM',
  admission: [
    { type: 'General admission', price: 'Free' },
    { type: 'Guided group tours', price: 'By reservation' },
  ],
  guidelines: [
    'Walk-in visitors are welcome; reservations are recommended for groups of 10 or more.',
    'Large bags, umbrellas, and food are deposited at the baggage counter.',
    'Photography without flash is allowed unless a gallery is marked otherwise.',
    'Please keep a safe distance from artworks and do not touch the displays.',
    'Follow the numbered gallery sequence for the recommended walkthrough.',
  ],
}

// Placeholder artworks: famous public-domain paintings. Images are in
// /public/art and come from Wikimedia Commons. Swap in the museum's real
// collection by changing these entries.
function artwork(id, title, artist, year, medium, image, description) {
  return { id, title, artist, year, medium, image: asset(`art/${image}`), description }
}

// grid = [column, row, columnSpan, rowSpan] on the 4 × 3 floor plan.
export const floors = [
  {
    id: 'ground',
    level: 'Ground Floor',
    name: 'Lobby & Orientation',
    galleries: [
      {
        id: 'g1',
        number: 'Gallery I',
        title: 'Orientation Hall',
        theme: 'Introduction',
        grid: [1, 1, 2, 3],
        color: '#c8553d',
        description:
          'Placeholder. The starting point of the walkthrough — an overview of the museum, its building, and the story of Filipino modernism.',
        artworks: [
          artwork(
            'a1',
            'Spoliarium',
            'Juan Luna',
            '1884',
            'Oil on canvas',
            'spoliarium.jpg',
            'The largest painting in the Philippines, at over 4 by 7.6 meters. Luna shows the spoliarium, the chamber beneath a Roman arena where slain gladiators were dragged and stripped of their armor. Spoliarium won a gold medal at the 1884 Exposición Nacional de Bellas Artes in Madrid, and Filipino reformers took the triumph as proof that Filipinos could equal the best artists of Europe. It is now the centerpiece of the National Museum of Fine Arts in Manila.'
          ),
          artwork(
            'a2',
            'Las Vírgenes Cristianas Expuestas al Populacho',
            'Félix Resurrección Hidalgo',
            '1884',
            'Oil on canvas',
            'christian-virgins.jpg',
            'Two early Christian women, stripped and bound, are mocked by a Roman crowd. Hidalgo won a silver medal for the painting at the same 1884 Madrid exposition where Luna took gold. José Rizal celebrated both victories in a famous toast, calling the two painters proof that genius knows no race. The painting shows Hidalgo’s cool, refined handling of light and his interest in suffering and dignity.'
          ),
        ],
      },
      {
        id: 'g2',
        number: 'Gallery II',
        title: 'The House Itself',
        theme: 'Architecture',
        grid: [3, 1, 2, 1],
        color: '#2d6a6a',
        description:
          'Placeholder. Original plans, furniture, and fixtures that tell the story of the house and its design.',
        artworks: [
          artwork(
            'a3',
            'Mona Lisa',
            'Leonardo da Vinci',
            'c. 1503–1519',
            'Oil on poplar panel',
            'mona-lisa.jpg',
            'Probably the most famous painting in the world, believed to portray Lisa Gherardini, wife of a Florentine silk merchant. Leonardo used sfumato, soft, smoky transitions between light and shadow, to create her elusive smile and the hazy landscape behind her. The portrait became a global celebrity after it was stolen from the Louvre in 1911; it was recovered two years later.'
          ),
          artwork(
            'a4',
            'Girl with a Pearl Earring',
            'Johannes Vermeer',
            'c. 1665',
            'Oil on canvas',
            'pearl-earring.jpg',
            'Not a portrait of a real sitter but a “tronie”, a Dutch study of a face, expression, or costume. A girl in an exotic blue-and-yellow turban turns toward us, lips parted, as light catches a single oversized pearl. Vermeer built the luminous effect from just a few strokes of paint. The work hangs in the Mauritshuis in The Hague and is often called the “Mona Lisa of the North”.'
          ),
          artwork(
            'a5',
            'Las Meninas',
            'Diego Velázquez',
            '1656',
            'Oil on canvas',
            'las-meninas.jpg',
            'The young Infanta Margarita Teresa stands surrounded by her maids of honor, a chaperone, a dog, and court dwarfs. Velázquez paints himself at a huge canvas on the left, and a mirror at the back reflects King Philip IV and Queen Mariana, as if they stand where the viewer does. This puzzle of who is looking at whom has made it one of the most analyzed paintings in Western art. It is in the Museo del Prado, Madrid.'
          ),
        ],
      },
      {
        id: 'g3',
        number: 'Gallery III',
        title: 'Archive Room',
        theme: 'Documents',
        grid: [3, 2, 2, 2],
        color: '#7a6c5d',
        description: 'Placeholder. Letters, photographs, and exhibition catalogues from the period.',
        artworks: [
          artwork(
            'a6',
            'The Night Watch',
            'Rembrandt van Rijn',
            '1642',
            'Oil on canvas',
            'night-watch.jpg',
            'A group portrait of an Amsterdam civic militia company led by Captain Frans Banninck Cocq. Instead of lining the men up in rows, Rembrandt shows them springing into motion, with dramatic spotlighting and a mysterious girl glowing in the crowd. Its darkened varnish gave it its nickname long after it was painted. In 1715 the canvas was trimmed on all sides to fit a wall in Amsterdam’s town hall. It is the pride of the Rijksmuseum.'
          ),
          artwork(
            'a7',
            'The Birth of Venus',
            'Sandro Botticelli',
            'c. 1484–1486',
            'Tempera on canvas',
            'birth-of-venus.jpg',
            'Venus, goddess of love, arrives at the shore on a scallop shell, blown by the wind god Zephyr while an attendant rushes to cover her with a flowered cloak. Painted for the Medici circle in Florence, it was one of the first large paintings since antiquity of a mythological nude, and a defining image of the Italian Renaissance. It hangs in the Uffizi Gallery, Florence.'
          ),
        ],
      },
    ],
  },
  {
    id: 'second',
    level: 'Second Floor',
    name: 'The Modernists',
    galleries: [
      {
        id: 'g4',
        number: 'Gallery IV',
        title: 'Early Moderns',
        theme: 'Painting, 1930s–1950s',
        grid: [1, 1, 2, 1],
        color: '#d9a441',
        description:
          'Placeholder. Works by the first generation of Filipino modernists who broke from academic tradition.',
        artworks: [
          artwork(
            'a8',
            'Impression, Sunrise',
            'Claude Monet',
            '1872',
            'Oil on canvas',
            'impression-sunrise.jpg',
            'An orange sun rises through mist over the harbor of Le Havre, painted in loose, rapid strokes. When Monet showed it in 1874, the critic Louis Leroy mocked the title and called the whole group “Impressionists”. The insult became the name of the movement that changed modern painting. It is in the Musée Marmottan Monet, Paris.'
          ),
          artwork(
            'a9',
            'A Sunday on La Grande Jatte',
            'Georges Seurat',
            '1884–1886',
            'Oil on canvas',
            'grande-jatte.jpg',
            'Parisians relax on an island in the Seine: strollers, a woman with a monkey on a leash, a girl in white. Seurat spent about two years on the canvas and built it entirely from tiny dots of pure color that blend in the viewer’s eye, a technique later called pointillism. It is at the Art Institute of Chicago.'
          ),
          artwork(
            'a10',
            'The Hay Wain',
            'John Constable',
            '1821',
            'Oil on canvas',
            'hay-wain.jpg',
            'A horse-drawn cart crosses the River Stour in Suffolk beside Willy Lott’s cottage, under a sky of drifting summer clouds. Constable painted the English countryside he grew up in with fresh, direct observation. When the painting won a gold medal at the 1824 Paris Salon, it inspired French painters, including Delacroix and later the Barbizon school. It is in the National Gallery, London.'
          ),
        ],
      },
      {
        id: 'g5',
        number: 'Gallery V',
        title: 'Abstraction',
        theme: 'Painting, 1950s–1970s',
        grid: [1, 2, 2, 2],
        color: '#3b5b92',
        description: 'Placeholder. Non-figurative works exploring form, color, and material.',
        artworks: [
          artwork(
            'a11',
            'Composition VII',
            'Wassily Kandinsky',
            '1913',
            'Oil on canvas',
            'composition-vii.jpg',
            'A storm of color, line, and shape that Kandinsky considered one of his most complex works. He made more than thirty preparatory drawings, watercolors, and oil studies, then painted the final canvas in just a few days. Kandinsky believed color could work like music, stirring emotion without depicting anything, and he is regarded as one of the pioneers of abstract art. It is in the State Tretyakov Gallery, Moscow.'
          ),
          artwork(
            'a12',
            'The Kiss',
            'Gustav Klimt',
            '1907–1908',
            'Oil and gold leaf on canvas',
            'the-kiss.jpg',
            'A couple embraces on a flowered meadow, wrapped in a shimmering cloak of geometric patterns. His robe is decorated with black-and-white rectangles, hers with colorful circles and flowers. The high point of Klimt’s “Golden Period”, it mixes painting with real gold leaf, inspired by Byzantine mosaics. The Austrian state bought it before it was even finished, and it is in the Belvedere, Vienna.'
          ),
        ],
      },
      {
        id: 'g6',
        number: 'Gallery VI',
        title: 'Sculpture Court',
        theme: 'Sculpture',
        grid: [3, 1, 2, 3],
        color: '#5e7d4f',
        description: 'Placeholder. Three-dimensional works in wood, metal, and stone.',
        artworks: [
          artwork(
            'a13',
            'The Scream',
            'Edvard Munch',
            '1893',
            'Oil, tempera and pastel on cardboard',
            'the-scream.jpg',
            'A figure clutches its face beneath a blood-red sky on a bridge above the Oslo fjord. Munch said the image came from a walk at sunset when he “sensed an infinite scream passing through nature”. He made several versions in paint, pastel, and print. It has become a universal symbol of modern anxiety. This version is in the National Museum, Oslo.'
          ),
          artwork(
            'a14',
            'Wanderer above the Sea of Fog',
            'Caspar David Friedrich',
            'c. 1818',
            'Oil on canvas',
            'wanderer.jpg',
            'A man in a dark green coat stands on a rocky peak, his back to us, gazing over a landscape swallowed by fog. Because we cannot see his face, we share his view and his feeling of awe. Friedrich often used this device, called the Rückenfigur or “figure from behind”. The painting is an icon of German Romanticism and its fascination with nature and the self. It is in the Hamburger Kunsthalle.'
          ),
        ],
      },
    ],
  },
  {
    id: 'third',
    level: 'Third Floor',
    name: 'Design & Living',
    galleries: [
      {
        id: 'g7',
        number: 'Gallery VII',
        title: 'Modern Living',
        theme: 'Furniture & Interiors',
        grid: [1, 1, 3, 2],
        color: '#a0522d',
        description:
          'Placeholder. A reconstructed mid-century interior with furniture and household objects.',
        artworks: [
          artwork(
            'a15',
            'The Starry Night',
            'Vincent van Gogh',
            '1889',
            'Oil on canvas',
            'starry-night.jpg',
            'A swirling night sky blazes above a quiet village, with a flame-like cypress tree rising in the foreground. Van Gogh painted it at the asylum in Saint-Rémy-de-Provence, based on the view from his east-facing window just before sunrise, and added the village from imagination. Its energetic brushwork and intense color made it one of the most recognized paintings in the world. It is at the Museum of Modern Art, New York.'
          ),
          artwork(
            'a16',
            'Café Terrace at Night',
            'Vincent van Gogh',
            '1888',
            'Oil on canvas',
            'cafe-terrace.jpg',
            'A café on the Place du Forum in Arles glows yellow under a deep blue, star-filled sky. Van Gogh set up his easel in the street and painted the scene on the spot at night. He was proud that he had made a night picture without using any black. It was the first painting in which he used his starry-sky background, a year before The Starry Night. It is in the Kröller-Müller Museum, Netherlands.'
          ),
        ],
      },
      {
        id: 'g8',
        number: 'Gallery VIII',
        title: 'Temporary Exhibitions',
        theme: 'Rotating',
        grid: [4, 1, 1, 3],
        color: '#444444',
        description: 'Placeholder. A flexible space for rotating and special exhibitions.',
        artworks: [
          artwork(
            'a17',
            'The Great Wave off Kanagawa',
            'Katsushika Hokusai',
            'c. 1831',
            'Woodblock print; ink and color on paper',
            'great-wave.jpg',
            'A towering wave curls like a claw over three fishing boats while Mount Fuji sits small and calm in the distance. The print is the most famous of Hokusai’s series Thirty-six Views of Mount Fuji. It used the newly imported pigment Prussian blue. Because it is a woodblock print, thousands of impressions were made, and examples are in museums worldwide, including the Metropolitan Museum of Art and the British Museum.'
          ),
        ],
      },
    ],
  },
]

export const exhibitions = [
  {
    id: 'e1',
    title: 'Permanent Collection',
    dates: 'Ongoing',
    location: 'Galleries I–VII',
    status: 'Ongoing',
    summary: 'Placeholder. The core collection, arranged as a walkthrough from the ground floor up.',
  },
  {
    id: 'e2',
    title: 'Special Exhibition Title',
    dates: 'Month DD, YYYY – Month DD, YYYY',
    location: 'Gallery VIII',
    status: 'Current',
    summary: 'Placeholder. Describe the current special exhibition.',
  },
  {
    id: 'e3',
    title: 'Upcoming Exhibition Title',
    dates: 'Opening Month YYYY',
    location: 'Gallery VIII',
    status: 'Upcoming',
    summary: 'Placeholder. Describe an upcoming exhibition.',
  },
]

// Every gallery in walkthrough order, with its floor attached.
export const allGalleries = floors.flatMap((floor) =>
  floor.galleries.map((g) => ({ ...g, floorId: floor.id, floorLevel: floor.level }))
)

export const getGallery = (id) => allGalleries.find((g) => g.id === id)

// Doorways between rooms in the virtual tour:
// [fromRoom, wallInFromRoom, toRoom, wallInToRoom, optional labels]
const connections = [
  ['g1', 'front', 'g2', 'back'],
  ['g2', 'right', 'g3', 'left'],
  ['g3', 'front', 'g4', 'back', { label: 'Stairs up to Second Floor', backLabel: 'Stairs down to Ground Floor' }],
  ['g4', 'right', 'g5', 'left'],
  ['g5', 'front', 'g6', 'back'],
  ['g6', 'right', 'g7', 'left', { label: 'Stairs up to Third Floor', backLabel: 'Stairs down to Second Floor' }],
  ['g7', 'front', 'g8', 'back'],
]

const exits = {
  g8: [{ wall: 'front', label: 'Exit the museum', href: '/' }],
}

export function doorsFor(roomId) {
  const doors = []
  for (const [from, fromWall, to, toWall, labels = {}] of connections) {
    if (from === roomId) {
      const g = getGallery(to)
      doors.push({ wall: fromWall, to, label: labels.label || `${g.number}: ${g.title}` })
    }
    if (to === roomId) {
      const g = getGallery(from)
      doors.push({ wall: toWall, to: from, label: labels.backLabel || `${g.number}: ${g.title}` })
    }
  }
  for (const exit of exits[roomId] || []) doors.push({ ...exit, exit: true })
  return doors
}
