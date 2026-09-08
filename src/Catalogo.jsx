import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { Link } from 'react-router-dom'

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

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50/40">
      <p className="text-xs uppercase tracking-widest text-rose-400 animate-pulse font-medium">Cargando catálogo con amor...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-pink-50/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-pink-600 font-semibold bg-pink-100/60 px-4 py-1.5 rounded-full inline-block mb-3 shadow-xs">
            ✨ Cosmética & Perfumería Exclusiva ✨
          </span>
          <h1 className="text-4xl font-light font-serif text-slate-800 tracking-tight">Catálogo de Mamá</h1>
        </header>

        {productos.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border border-pink-100 shadow-sm max-w-md mx-auto">
            <p className="text-sm text-slate-500 font-light">Pronto tendremos productos hermosos disponibles para ti 🌸</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {productos.map(p => (
              <Link 
                to={`/producto/${p.id}`} 
                key={p.id} 
                className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-rose-50/50 mb-4 border border-rose-100/50">
                    <img src={p.fotoPortada} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h2 className="text-base font-medium text-slate-800 mb-1 line-clamp-1">{p.nombre}</h2>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-rose-50">
                  <span className="text-pink-600 font-bold text-base">${p.precio?.toLocaleString('es-CL')}</span>
                  <span className="text-xs bg-pink-50 text-pink-600 font-medium px-3 py-1.5 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    Ver detalle 💕
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalogo