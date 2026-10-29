import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import { formatCLP, mensajePedido, totalCarrito, whatsappUrl } from './tienda'
import { Icono } from './ui'

export default function Carrito() {
  const { lineas, cambiarCantidad, quitar } = useCart()

  if (lineas.length === 0)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Tu carrito está vacío</h1>
        <p className="mt-3 text-suave">Descubre nuestros perfumes y cosméticos.</p>
        <Link to="/catalogo" className="mt-8 inline-block rounded-full bg-rosa px-8 py-4 text-white">Ver catálogo</Link>
      </div>
    )

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-5xl">Mi carrito</h1>
      <ul className="mt-8 space-y-4">
        {lineas.map((l) => (
          <li key={l.id} className="flex gap-4 rounded-2xl bg-white p-3 sombra">
            {l.foto && <img src={l.foto} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />}
            <div className="flex min-w-0 flex-1 flex-col">
              {l.marca && <p className="text-xs uppercase tracking-widest text-suave">{l.marca}</p>}
              <Link to={`/producto/${l.id}`} className="font-serif text-lg leading-tight hover:underline">{l.nombre}</Link>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 rounded-full border border-borde">
                  <button onClick={() => cambiarCantidad(l.id, l.cantidad - 1)} className="p-2" aria-label="Quitar uno"><Icono n="menos" className="h-3.5 w-3.5" /></button>
                  <span className="w-6 text-center text-sm">{l.cantidad}</span>
                  <button onClick={() => cambiarCantidad(l.id, l.cantidad + 1)} className="p-2" aria-label="Agregar uno"><Icono n="mas" className="h-3.5 w-3.5" /></button>
                </div>
                <span className="font-semibold">{formatCLP(l.precio * l.cantidad)}</span>
              </div>
            </div>
            <button onClick={() => quitar(l.id)} className="self-start p-2 text-suave hover:text-peligro" aria-label={`Quitar ${l.nombre}`}><Icono n="basura" className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-2xl bg-rosa-claro p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-lg">Total</span>
          <span className="font-serif text-3xl">{formatCLP(totalCarrito(lineas))}</span>
        </div>
        <a href={whatsappUrl(mensajePedido(lineas))} target="_blank" rel="noreferrer" className="mt-6 flex h-14 items-center justify-center rounded-full bg-whatsapp font-medium text-white sombra-alta transition hover:brightness-110">
          Pedir por WhatsApp
        </a>
        <p className="mt-3 text-center text-xs text-suave">Coordinamos pago y entrega por WhatsApp. Sin pagos en línea.</p>
      </div>
    </div>
  )
}
