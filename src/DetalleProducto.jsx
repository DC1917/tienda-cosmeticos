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

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-xs uppercase text-pink-400 font-medium">Cargando producto...</div>
  if (!producto) return <div className="min-h-screen flex flex-col items-center justify-center"><p className="mb-4 text-slate-600">Producto no encontrado</p><Link to="/" className="text-xs uppercase bg-pink-500 text-white px-5 py-2.5 rounded-2xl shadow-sm">Volver al inicio</Link></div>

  const galeria = [producto.fotoPortada, ...(producto.fotosGaleria || [])].filter(Boolean)

  const enviarWhatsApp = () => {
    const mensaje = `¡Hola! Me interesa comprar este producto que vi en la tiendita:%0A• *${producto.nombre}*%0A• Precio: $${producto.precio?.toLocaleString('es-CL')}%0A%0A¿Me confirmas si está disponible? 💖`
    window.open(`https://wa.me/${TELEFONO_WHATSAPP}?text=${mensaje}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-xs uppercase tracking-widest text-pink-600 font-medium hover:text-pink-700 mb-6 inline-block bg-pink-50 px-4 py-2 rounded-2xl transition-colors">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/90 backdrop-blur-xs p-8 md:p-10 rounded-3xl border border-pink-100 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-rose-50/30 border border-rose-100">
              <img src={galeria[fotoActiva]} alt="" className="w-full h-full object-cover" />
            </div>
            {galeria.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galeria.map((foto, i) => (
                  <button key={i} onClick={() => setFotoActiva(i)} className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${i === fotoActiva ? 'border-pink-500 scale-105' : 'border-pink-100 opacity-60'}`}>
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-semibold">Disponible 🌸</span>
              <h1 className="text-2xl font-light font-serif text-slate-800 mt-3 mb-2">{producto.nombre}</h1>
              <p className="text-3xl font-bold text-pink-600 mb-6">${producto.precio?.toLocaleString('es-CL')}</p>
              
              <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100/60 mb-6">
                <p className="text-xs uppercase tracking-widest text-pink-600 font-semibold mb-2">Descripción</p>
                <p className="text-sm text-slate-600 font-light leading-relaxed whitespace-pre-line">{producto.descripcion}</p>
              </div>
            </div>

            <button
              onClick={enviarWhatsApp}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
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