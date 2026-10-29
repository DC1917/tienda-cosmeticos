import { Link, NavLink } from 'react-router-dom'
import { useCart } from './CartContext'
import { STORE, NOMBRE, formatCLP, precioFinal, enOferta, whatsappUrl } from './tienda'

// Íconos de trazo (estilo lucide), sin dependencias.
const PATHS = {
  bolsa: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  buscar: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  flecha: 'M5 12h14M12 5l7 7-7 7',
  mas: 'M12 5v14M5 12h14',
  menos: 'M5 12h14',
  basura: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  lapiz: 'M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z',
  cerrar: 'M18 6 6 18M6 6l12 12',
  foto: 'M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10M3 16l5-5 5 5M14 14l1-1 2 2M19 16v6M16 19h6',
  salir: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chat: 'M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.7A8.5 8.5 0 1 1 21 11.5z',
}
export function Icono({ n, className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[n]} />
    </svg>
  )
}

export function Logo({ className = 'text-2xl' }) {
  return (
    <span className={`font-serif tracking-wide ${className}`}>
      {STORE.nombre} <span className="italic text-rosa">{STORE.apellido}</span>
    </span>
  )
}

const navClase = ({ isActive }) => (isActive ? 'text-tinta' : 'text-suave hover:text-tinta transition-colors')

export function Header() {
  const { cantidad } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-borde/60 bg-fondo/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label={`${NOMBRE}, inicio`}><Logo /></Link>
        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/" end className={(s) => `hidden sm:block ${navClase(s)}`}>Inicio</NavLink>
          <NavLink to="/catalogo" className={(s) => `hidden sm:block ${navClase(s)}`}>Catálogo</NavLink>
          <Link to="/carrito" className="relative rounded-full p-2 transition-colors hover:bg-acento" aria-label={`Carrito, ${cantidad} productos`}>
            <Icono n="bolsa" />
            {cantidad > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rosa px-1 text-[11px] font-semibold text-white">
                {cantidad}
              </span>
            )}
          </Link>
        </nav>
      </div>
      <div className="flex justify-center gap-8 border-t border-borde/40 py-2 text-sm sm:hidden">
        <NavLink to="/" end className={navClase}>Inicio</NavLink>
        <NavLink to="/catalogo" className={navClase}>Catálogo</NavLink>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-borde bg-rosa-claro/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-suave">{STORE.slogan}</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Tienda</p>
          <ul className="space-y-2 text-suave">
            <li><Link to="/catalogo" className="hover:text-tinta">Catálogo</Link></li>
            <li><Link to="/carrito" className="hover:text-tinta">Mi carrito</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Contacto</p>
          <ul className="space-y-2 text-suave">
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-tinta"><Icono n="chat" className="h-4 w-4" /> WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-suave">© {new Date().getFullYear()} {NOMBRE} · Hecho con cariño en Chile</p>
    </footer>
  )
}

export function WhatsAppFlotante() {
  return (
    <a
      href={whatsappUrl(`¡Hola ${NOMBRE}! Tengo una consulta`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white sombra-alta transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.3 11.3 0 0 0 12.04.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.36 1.37h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03z" /></svg>
    </a>
  )
}

export function TarjetaProducto({ p }) {
  const agotado = !(p.stock > 0)
  const oferta = enOferta(p)
  return (
    <Link to={`/producto/${p.id}`} className="group tarjeta block overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-acento">
        {p.fotos?.[0] && (
          <img src={p.fotos[0]} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {oferta && !agotado && <span className="rounded-full bg-rosa px-3 py-1 text-xs font-medium text-white">Oferta</span>}
          {agotado && <span className="rounded-full bg-tinta/80 px-3 py-1 text-xs font-medium text-white">Agotado</span>}
        </div>
      </div>
      <div className="p-4">
        {p.marca && <p className="eyebrow">{p.marca}</p>}
        <h3 className="mt-1 line-clamp-2 text-lg leading-snug">{p.nombre}</h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold">{formatCLP(precioFinal(p))}</span>
          {oferta && <span className="text-sm text-suave line-through">{formatCLP(p.precio)}</span>}
        </div>
      </div>
    </Link>
  )
}

export function Cargando({ texto = 'Cargando…' }) {
  return <p className="py-24 text-center text-suave" role="status">{texto}</p>
}
