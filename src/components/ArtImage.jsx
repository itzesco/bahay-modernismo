// Shows an artwork image, or a striped placeholder in the gallery color
// when no image is set.
export default function ArtImage({ src, alt, color = '#888', label, className = '' }) {
  if (src) {
    return <img src={src} alt={alt} className={`art-img ${className}`} loading="lazy" draggable="false" />
  }
  return (
    <div className={`art-img placeholder ${className}`} style={{ '--c': color }} role="img" aria-label={alt}>
      <span>{label || 'Image'}</span>
    </div>
  )
}
