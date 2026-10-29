import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const CLOUD_NAME = 'lxekw8dr'
const UPLOAD_PRESET = 'n9hprk0h'

const CLAVE_ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || "1234"

async function subirFoto(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  return data.secure_url
}

function AdminProductos() {
  const [autenticado, setAutenticado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  
  const [archivoPortada, setArchivoPortada] = useState(null)
  const [archivosGaleria, setArchivosGaleria] = useState([])
  
  const [editandoId, setEditandoId] = useState(null)
  const [fotoPortadaActual, setFotoPortadaActual] = useState('')
  const [fotosGaleriaActual, setFotosGaleriaActual] = useState([])

  const [subiendo, setSubiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (localStorage.getItem('admin_sesion_cosmeticos') === 'activa') {
      setAutenticado(true)
    }
  }, [])

  async function cargarProductos() {
    const snapshot = await getDocs(collection(db, 'cosmeticos'))
    setProductos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    if (autenticado) {
      cargarProductos()
    }
  }, [autenticado])

  function handleLogin(e) {
    e.preventDefault()
    if (passwordInput === CLAVE_ADMIN) {
      setAutenticado(true)
      localStorage.setItem('admin_sesion_cosmeticos', 'activa')
    } else {
      alert('Contraseña incorrecta')
      setPasswordInput('')
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('admin_sesion_cosmeticos')
    setAutenticado(false)
  }

  function iniciarEdicion(p) {
    setEditandoId(p.id)
    setNombre(p.nombre || '')
    setDescripcion(p.descripcion || '')
    setPrecio(p.precio || '')
    setFotoPortadaActual(p.fotoPortada || '')
    setFotosGaleriaActual(p.fotosGaleria || [])
    setArchivoPortada(null)
    setArchivosGaleria([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setNombre('')
    setDescripcion('')
    setPrecio('')
    setFotoPortadaActual('')
    setFotosGaleriaActual([])
    setArchivoPortada(null)
    setArchivosGaleria([])
    setMensaje('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubiendo(true)
    setMensaje(editandoId ? 'Actualizando producto...' : 'Subiendo fotos a la nube...')

    try {
      let urlPortada = fotoPortadaActual
      if (archivoPortada) {
        urlPortada = await subirFoto(archivoPortada)
      }

      const urlsGaleria = [...fotosGaleriaActual]
      for (const archivo of archivosGaleria) {
        const url = await subirFoto(archivo)
        urlsGaleria.push(url)
      }

      const datosProducto = {
        nombre,
        descripcion,
        precio: parseInt(precio, 10) || 0, // Forzar número entero sin decimales raros
        fotoPortada: urlPortada,
        fotosGaleria: urlsGaleria,
        disponible: true,
      }

      if (editandoId) {
        await updateDoc(doc(db, 'cosmeticos', editandoId), datosProducto)
        setMensaje('¡Producto actualizado correctamente! ✨')
      } else {
        if (!archivoPortada) {
          setMensaje('Falta la foto de portada.')
          setSubiendo(false)
          return
        }
        await addDoc(collection(db, 'cosmeticos'), datosProducto)
        setMensaje('¡Producto agregado correctamente! 🌸')
      }

      cancelarEdicion()
      cargarProductos()
    } catch (err) {
      setMensaje('Ocurrió un error al guardar el producto.')
    }

    setSubiendo(false)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    await deleteDoc(doc(db, 'cosmeticos', id))
    cargarProductos()
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg)] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-elegant max-w-md w-full text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold block mb-2">���� Panel de Mamá 🌸</span>
          <h1 className="text-2xl font-light font-serif text-[var(--fg)] mb-2">Acceso Admin</h1>
          <p className="text-xs text-[var(--muted)] font-light mb-6">Ingresa tu clave secreta para administrar la tiendita.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña secreta"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-[var(--accent-soft)] rounded-2xl p-3.5 text-sm bg-[var(--bg-subtle)] text-center focus:outline-none focus:border-[var(--accent)] transition-all text-slate-800"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent-600)] hover:to-[var(--accent-500)] text-white py-3.5 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer"
            >
              Ingresar al Panel 💕
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 bg-gradient-to-b from-[var(--bg-subtle)] to-[var(--bg)] min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[var(--border)] shadow-elegant">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-semibold">Modo Administrador</span>
          <h2 className="text-lg font-light font-serif text-[var(--fg)]">Tienda de Mamá 💖</h2>
        </div>
        <button 
          onClick={cerrarSesion} 
          className="text-xs text-[var(--accent-600)] uppercase tracking-widest border border-[var(--accent-soft)] px-4 py-2 rounded-2xl hover:bg-[var(--accent-soft)] transition-colors cursor-pointer font-medium"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl border border-[var(--border)] shadow-elegant">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light font-serif tracking-tight text-[var(--fg)]">
            {editandoId ? '✨ Editar producto' : '���� Agregar nuevo producto'}
          </h2>
          {editandoId && (
            <button 
              type="button" 
              onClick={cancelarEdicion}
              className="text-xs uppercase tracking-widest text-[var(--accent-600)] hover:text-[var(--accent-500)] underline cursor-pointer"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-semibold mb-2">Título del producto</label>
            <input
              type="text"
              placeholder="Ej: Perfume Dolce&Gabbana hombre 100ml"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-[var(--accent-soft)] rounded-2xl p-3.5 text-sm bg-[var(--bg-subtle)] focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-semibold mb-2">Descripción / Detalle del producto</label>
            <textarea
              placeholder="Ej: Notas amaderadas, larga duración, ideal para regalo..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-[var(--accent-soft)] rounded-2xl p-3.5 text-sm bg-[var(--bg-subtle)] focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-slate-800 h-28"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-semibold mb-2">Precio ($ CLP)</label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder="Ej: 15990"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-[var(--accent-soft)] rounded-2xl p-3.5 text-sm bg-[var(--bg-subtle)] focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border border-[var(--accent-soft)] rounded-2xl bg-[var(--bg-subtle)]">
              <label className="block text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-semibold mb-2">
                {editandoId ? 'Cambiar foto portada (opcional)' : 'Foto de portada *'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setArchivoPortada(e.target.files[0])}
                className="w-full text-xs text-[var(--muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-50)] file:text-[var(--accent)] hover:file:bg-[var(--accent-600)] cursor-pointer"
                required={!editandoId}
              />
              {editandoId && fotoPortadaActual && (
                <p className="text-[10px] text-[var(--accent)] mt-2">Ya tiene una portada asignada.</p>
              )}
            </div>

            <div className="p-4 border border-[var(--accent-soft)] rounded-2xl bg-[var(--bg-subtle)]">
              <label className="block text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-semibold mb-2">Fotos de galería (Opcional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setArchivosGaleria(Array.from(e.target.files))}
                className="w-full text-xs text-[var(--muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--rose-200)] file:text-[var(--stone-700)] hover:file:bg-[var(--rose-300)] cursor-pointer"
              />
              {editandoId && fotosGaleriaActual.length > 0 && (
                <p className="text-[10px] text-[var(--accent)] mt-2">Tiene {fotosGaleriaActual.length} foto(s) en galería.</p>
              )}
            </div>
          </div>

          {mensaje && (
            <div className="p-3 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] text-xs text-center font-medium border border-[var(--accent-soft)]">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={subiendo}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent-600)] hover:to-[var(--accent-500)] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {subiendo ? 'Guardando en la nube...' : (editandoId ? 'Actualizar producto ✨' : 'Guardar producto 🌸')}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl border border-[var(--border)] shadow-elegant">
        <h2 className="text-xl font-light font-serif tracking-tight text-[var(--fg)] mb-6">
          Catálogo actual ({productos.length})
        </h2>

        {productos.length === 0 ? (
          <p className="text-xs text-[var(--muted)] font-light text-center py-6">No hay productos registrados todavía.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {productos.map(p => (
              <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={p.fotoPortada} alt={p.nombre} className="w-14 h-14 object-cover rounded-2xl border border-[var(--border)] shadow-xs" />
                  <div>
                    <p className="font-medium text-[var(--fg)] text-sm">{p.nombre}</p>
                    <p className="text-[var(--accent)] text-xs font-bold mt-0.5">$${p.precio?.toLocaleString('es-CL')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => iniciarEdicion(p)} 
                    className="text-xs text-[var(--stone-600)] hover:text-[var(--accent)] font-medium tracking-wide uppercase transition-colors cursor-pointer px-3 py-2 border border-[var(--accent-soft)] rounded-xl bg-[var(--accent-soft)]/50"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(p.id)} 
                    className="text-xs text-[var(--stone-400)] hover.text-red-600 font-medium tracking-wide uppercase transition-colors cursor-pointer px-3 py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductos