import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducto } from './productos'
import { useCart } from './CartContext'
import { formatCLP, precioFinal, enOferta, whatsappUrl, NOMBRE } from './tienda'
import { Cargando, Icono } from './ui'

export default function DetalleProducto() {
  const { id } = useParams()
  const { producto: p, cargando } = useProducto(id)
  const [foto, setFoto] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregar } = useCart()

  if (cargando) return <Cargando />
  if (!p)
    return (
      <div className="py-24 text-center">
        <p className="text-suave">Este producto no existe.</p>
        <Link to="/catalogo" className="mt-4 inline-block text-rosa underline">Volver al catálogo</Link>
      </div>
    )

  const fotos = p.fotos || []
  const agotado = !(p.stock > 0)
  const precio = precioFinal(p)

  const alAgregar = () => {
    agregar({ id: p.id, nombre: p.nombre, marca: p.marca, precio, foto: fotos[0], cantidad, stock: p.stock })
    setAgregado(true)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-acento sombra">
          {fotos[foto] && <img src={fotos[foto]} alt={p.nombre} className="h-full w-full object-cover" />}
          {agotado && <span className="absolute left-4 top-4 rounded-full bg-tinta/80 px-4 py-1.5 text-sm text-white">Agotado</span>}
          {!agotado && enOferta(p) && <span className="absolute left-4 top-4 rounded-full bg-rosa px-4 py-1.5 text-sm text-white">Oferta</span>}
        </div>
        {fotos.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto">
            {fotos.map((src, i) => (
              <button key={src + i} onClick={() => setFoto(i)} aria-label={`Ver foto ${i + 1}`} className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === foto ? 'border-rosa' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <Link to={`/catalogo?categoria=${encodeURIComponent(p.categoria)}`} className="eyebrow hover:underline">{p.categoria}</Link>
        {p.marca && <p className="mt-4 text-sm uppercase tracking-widest text-suave">{p.marca}</p>}
        <h1 className="mt-1 text-4xl leading-tight sm:text-5xl">{p.nombre}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{formatCLP(precio)}</span>
          {enOferta(p) && <span className="text-lg text-suave line-through">{formatCLP(p.precio)}</span>}
        </div>
        <p className="mt-6 whitespace-pre-line leading-relaxed text-suave">{p.descripcion}</p>

        {agotado ? (
          <a href={whatsappUrl(`¡Hola ${NOMBRE}! ¿Me avisas cuando vuelva "${p.nombre}"?`)} target="_blank" rel="noreferrer" className="mt-8 rounded-2xl bg-acento p-4 text-center text-suave hover:text-tinta">
            Agotado por ahora. <span className="underline">Escríbenos por WhatsApp</span> y te avisamos cuando vuelva.
          </a>
        ) : (
          <>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-full border border-borde bg-white px-2 sm:w-40">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="rounded-full p-2 hover:bg-acento" aria-label="Quitar uno"><Icono n="menos" className="h-4 w-4" /></button>
                <span className="text-lg font-medium" aria-live="polite">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(p.stock, cantidad + 1))} className="rounded-full p-2 hover:bg-acento" aria-label="Agregar uno"><Icono n="mas" className="h-4 w-4" /></button>
              </div>
              <button onClick={alAgregar} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-rosa font-medium text-white sombra-alta transition hover:brightness-110">
                <Icono n="bolsa" /> Agregar al carrito
              </button>
            </div>
            {agregado && (
              <p className="mt-3 text-sm" role="status">
                ¡Agregado al carrito! <Link to="/carrito" className="text-rosa underline">Ver carrito</Link>
              </p>
            )}
            {p.stock <= 3 && <p className="mt-3 text-sm text-rosa">¡Quedan solo {p.stock}!</p>}
          </>
        )}
      </div>
    </div>
  )
}
