import { Link } from 'react-router-dom'
import { useCart } from './CartContext'

function Header() {
  const { carrito } = useCart()
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <header className="store-header">
      <div className="store-header__inner">
        <Link to="/" className="store-brand" aria-label="Cosmética de Mamá, inicio">
          <span className="store-brand__name">Cosmética <span>de Mamá</span></span>
          <span className="store-brand__tagline">CUIDADO Y BELLEZA PARA CADA DÍA</span>
        </Link>

        <nav className="store-nav" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/#coleccion">Colección</Link>
        </nav>

        <Link
          to="/carrito"
          className="store-cart"
          aria-label={totalItems ? `Carrito, ${totalItems} productos` : 'Carrito'}
        >
          <span>Carrito</span>
          <span className="store-cart__icon" aria-hidden="true">↗</span>
          {totalItems > 0 && <span className="store-cart__count">{totalItems}</span>}
        </Link>
      </div>
    </header>
  )
}

export default Header
