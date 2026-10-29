import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { Link } from 'react-router-dom'

function SakuraFlower({ className = '' }) {
  return (
    <svg
      className={`sakura-mark ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 72, 144, 216, 288].map(angle => (
        <ellipse
          key={angle}
          cx="50"
          cy="24"
          rx="16"
          ry="24"
          fill="#d88e9a"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="#f6d99e" />
    </svg>
  )
}

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function obtenerProductos() {
      const snapshot = await getDocs(collection(db, 'cosmeticos'))
      setProductos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setCargando(false)
    }
    obtenerProductos()
  }, [])

  if (cargando) {
    return (
      <div className="catalog-loading" role="status">
        <SakuraFlower />
        <p>Cargando catálogo...</p>
      </div>
    )
  }

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        <section className="catalog-hero" aria-labelledby="catalog-title">
          <div className="catalog-hero__copy">
            <p className="catalog-eyebrow"><span /> Belleza en cada ritual</p>
            <h1 id="catalog-title">Un momento<br /><em>para ti.</em></h1>
            <p className="catalog-hero__description">
              Encuentra tus favoritos de cosmética y perfumería para sentirte bien todos los días.
            </p>
            <a className="catalog-hero__link" href="#coleccion">
              Descubrir la colección <span aria-hidden="true">↓</span>
            </a>
            <p className="catalog-hero__note">DETALLES QUE TE HACEN SENTIR BIEN</p>
          </div>

          <div className="catalog-hero__art" aria-hidden="true">
            <svg className="catalog-hero__branch" viewBox="0 0 360 300" focusable="false">
              <path d="M20 280C78 234 112 190 157 151S232 102 319 26M91 218C71 191 57 157 55 126M157 151C192 151 221 158 250 179M231 104C230 75 244 51 269 35" />
            </svg>
            <SakuraFlower className="catalog-hero__blossom--one" />
            <SakuraFlower className="catalog-hero__blossom--two" />
            <SakuraFlower className="catalog-hero__blossom--three" />
            <SakuraFlower className="catalog-hero__blossom--four" />
            <span className="catalog-hero__art-label">Un detalle de color para tu día</span>
          </div>
        </section>

        <section id="coleccion" className="catalog-collection" aria-labelledby="collection-title">
          <div className="catalog-section-heading">
            <div>
              <p className="catalog-eyebrow"><span /> Productos para ti</p>
              <h2 id="collection-title">La colección</h2>
            </div>
            <span className="catalog-section-heading__count">
              {productos.length.toString().padStart(2, '0')} ARTÍCULOS
            </span>
          </div>

          {productos.length === 0 ? (
            <div className="catalog-empty">
              <SakuraFlower className="catalog-empty__mark" />
              <h3>Un espacio para lo que viene</h3>
              <p>Pronto encontrarás nuevos productos en nuestra colección.</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {productos.map((producto, index) => (
                <Link
                  to={`/producto/${producto.id}`}
                  key={producto.id}
                  className="product-card"
                  aria-label={`Ver ${producto.nombre}`}
                >
                  <div className="product-card__image-wrap">
                    <img
                      src={producto.fotoPortada}
                      alt={producto.nombre}
                      className="product-card__image"
                      loading="lazy"
                    />
                    <span className="product-card__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="product-card__arrow" aria-hidden="true">↗</span>
                  </div>
                  <div className="product-card__details">
                    <div>
                      <h3>{producto.nombre}</h3>
                      <p>{producto.descripcion || 'Un detalle para tu ritual de cuidado.'}</p>
                    </div>
                    <span className="product-card__price">
                      {producto.precio != null
                        ? `$${producto.precio.toLocaleString('es-CL')}`
                        : 'Consultar'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Catalogo
