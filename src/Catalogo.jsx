import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductos } from './productos'
import { CATEGORIAS, precioFinal } from './tienda'
import { Cargando, Icono, TarjetaProducto } from './ui'

export default function Catalogo() {
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') || ''
  const q = params.get('q') || ''
  const orden = params.get('orden') || ''
  const { productos, cargando, error } = useProductos()

  const lista = useMemo(() => {
    let r = productos
    if (categoria) r = r.filter((p) => p.categoria === categoria)
    if (q.trim()) {
      const t = q.toLowerCase()
      r = r.filter((p) => `${p.nombre} ${p.marca} ${p.descripcion}`.toLowerCase().includes(t))
    }
    if (orden) r = [...r].sort((a, b) => (orden === 'asc' ? 1 : -1) * (precioFinal(a) - precioFinal(b)))
    return r
  }, [productos, categoria, q, orden])

  const set = (k, v) =>
    setParams((p) => { v ? p.set(k, v) : p.delete(k); return p }, { replace: true })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Tienda</p>
      <h1 className="mt-2 text-5xl">Catálogo</h1>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Icono n="buscar" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-suave" />
          <input
            type="search"
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Buscar productos o marcas…"
            className="h-12 w-full rounded-full border border-borde bg-white pl-11 pr-4 text-base outline-none focus:ring-2 focus:ring-rosa/30"
          />
        </label>
        <label>
          <span className="sr-only">Ordenar</span>
          <select value={orden} onChange={(e) => set('orden', e.target.value)} className="h-12 w-full rounded-full border border-borde bg-white px-5 text-base outline-none">
            <option value="">Ordenar: novedades</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2">
        {['', ...CATEGORIAS].map((c) => (
          <button
            key={c || 'todo'}
            onClick={() => set('categoria', c)}
            aria-pressed={categoria === c}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${categoria === c ? 'border-rosa bg-rosa text-white' : 'border-borde bg-white hover:bg-acento'}`}
          >
            {c || 'Todo'}
          </button>
        ))}
      </div>

      {cargando ? (
        <Cargando texto="Cargando productos…" />
      ) : error ? (
        <p className="mt-16 text-center text-suave">No pudimos cargar los productos. Revisa tu conexión e intenta de nuevo.</p>
      ) : lista.length === 0 ? (
        <p className="mt-16 text-center text-suave">No encontramos productos. Prueba con otra búsqueda.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-suave">{lista.length} {lista.length === 1 ? 'producto' : 'productos'}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {lista.map((p) => <TarjetaProducto key={p.id} p={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
