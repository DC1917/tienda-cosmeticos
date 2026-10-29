import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(0)

  // CAMBIA ESTE NÚMERO POR EL WHATSAPP DE TU MAMÁ (con código de país, ej: 569...)
  const TELEFONO_WHATSAPP = "56912345678"

  useEffect(() => {
    async function cargar() {
      const snap = await getDoc(doc(db, 'cosmeticos', id))
      if (snap.exists()) setProducto({ id: snap.id, ...snap.data() })
      setCargando(false)
    }
    cargar()
  }, [id])

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-xs uppercase text-[var(--muted)] font-medium">Cargando producto...</div>
  if (!producto) return <div className="min-h-screen flex flex-col items-center justify-center"><p className="mb-4 text-[var(--muted)]">Producto no encontrado</p><Link to="/" className="text-xs uppercase bg-[var(--accent)] text-white px-5 py-2.5 rounded-2xl transition-colors shadow-elegant">Volver al inicio</Link></div>

  const galeria = [producto.fotoPortada, ...(producto.fotosGaleria || [])].filter(Boolean)

  const enviarWhatsApp = () => {
    const mensaje = `¡Hola! Me interesa comprar este producto que vi en la tiendita:%0A• *${producto.nombre}*%0A• Precio: $${producto.precio?.toLocaleString('es-CL')}%0A%0A¿Me confirmas si está disponible? 💖`
    window.open(`https://wa.me/${TELEFONO_WHATSAPP}?text=${mensaje}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--bg)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium hover:text-[var(--accent)] mb-6 inline-block bg-[var(--accent-soft)] text-[var(--accent)] px-4 py-2 rounded-full transition-colors">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--card)] backdrop-blur-xs p-8 md:p-10 rounded-2xl border border-[var(--border)] shadow-elegant">
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)]">
              <img src={galeria[fotoActiva]} alt="" className="w-full h-full object-cover" />
            </div>
            {galeria.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galeria.map((foto, i) => (
                  <button key={i} onClick={() => setFotoActiva(i)} className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${i === fotoActiva ? 'border-[var(--accent)] scale-105' : 'border-[var(--border)] opacity-60'}`}>
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-1 rounded-full font-semibold">Disponible 🌸</span>
              <h1 className="text-2xl font-light font-serif text-[var(--fg)] mt-3 mb-2">{producto.nombre}</h1>
              <p className="text-3xl font-bold text-[var(--accent)] mb-6">$${producto.precio?.toLocaleString('es-CL')}</p>
              
              <div className="bg-[var(--bg-subtle)] p-5 rounded-2xl border border-[var(--border)]/60 mb-6">
                <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold mb-2">Descripción</p>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed whitespace-pre-line">{producto.descripcion}</p>
              </div>
            </div>

            <button
              onClick={enviarWhatsApp}
              className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent-600)] hover:to-[var(--accent-500)] text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬 Comprar o Consultar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto