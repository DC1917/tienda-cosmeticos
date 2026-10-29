import { Link } from 'react-router-dom'
import { useProductos } from './productos'
import { CATEGORIAS, STORE } from './tienda'
import { Icono, TarjetaProducto } from './ui'

import HERO from './assets/hero.jpg'
const FOTO_CATEGORIA = {
  Perfumes: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
  Maquillaje: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
  'Cuidado de la piel': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
  'Cuidado capilar': 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600',
  'Sets de regalo': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
}

export default function Inicio() {
  const { productos } = useProductos()
  const destacados = productos.filter((p) => p.destacado).slice(0, 8)

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover object-[78%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-fondo via-fondo/80 to-fondo/10 sm:via-fondo/60 sm:to-transparent" />
        <div className="relative mx-auto flex min-h-[22rem] max-w-6xl flex-col justify-center px-4 py-12 sm:min-h-[26rem]">
          <p className="eyebrow aparecer">Perfumería boutique</p>
          <h1 className="aparecer mt-3 max-w-xl text-5xl leading-[1.05] sm:text-6xl">
            {STORE.nombre} <span className="italic text-rosa">{STORE.apellido}</span>
          </h1>
          <p className="aparecer mt-5 max-w-md text-lg text-suave">{STORE.slogan}</p>
          <div className="aparecer mt-8">
            <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-rosa px-8 py-4 text-sm font-medium tracking-wide text-white sombra-alta transition-all hover:-translate-y-0.5 hover:brightness-110">
              Ver catálogo <Icono n="flecha" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="eyebrow">Explora</p>
          <h2 className="mt-2 text-4xl">Categorías</h2>
        </div>
        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {CATEGORIAS.map((c) => (
            <Link key={c} to={`/catalogo?categoria=${encodeURIComponent(c)}`} className="group tarjeta relative w-40 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto">
              <img src={FOTO_CATEGORIA[c]} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-serif text-xl text-white">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {destacados.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Favoritos</p>
              <h2 className="mt-2 text-4xl">Productos destacados</h2>
            </div>
            <Link to="/catalogo" className="text-sm text-rosa hover:underline">Ver todo →</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {destacados.map((p) => <TarjetaProducto key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 grid max-w-5xl gap-6 px-4 text-center sm:grid-cols-3">
        {[
          ['Asesoría personal', 'Te ayudo a elegir el perfume o producto ideal para ti.'],
          ['Pedido fácil', 'Arma tu carrito y envíalo por WhatsApp en un clic.'],
          ['Productos originales', 'Cada producto es seleccionado con cariño.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-white p-6 sombra">
            <div className="mx-auto mb-3 h-px w-10 bg-oro" />
            <h3 className="text-2xl">{t}</h3>
            <p className="mt-2 text-sm text-suave">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-4 text-center">
        <p className="eyebrow">Sobre mí</p>
        <h2 className="mt-2 text-4xl">Hola, soy {STORE.nombre}</h2>
        <p className="mt-6 text-lg leading-relaxed text-suave">
          Soy una emprendedora chilena apasionada por la belleza. Selecciono cada perfume y cosmético
          con cariño para que encuentres productos de calidad a buen precio. Escríbeme por WhatsApp y te
          asesoro personalmente para encontrar lo que buscas.
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-oro" />
      </section>
    </>
  )
}
