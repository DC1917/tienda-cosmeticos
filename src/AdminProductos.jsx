import { useEffect, useState } from 'react'
import { addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from './firebase'
import { productosRef, useProductos } from './productos'
import { CATEGORIAS, formatCLP, precioFinal } from './tienda'
import { Cargando, Icono, Logo } from './ui'

// Fotos en Cloudinary (subida sin firma, preset de la cuenta de la tienda).
const CLOUD_NAME = 'lxekw8dr'
const UPLOAD_PRESET = 'n9hprk0h'

async function subirFoto(file) {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok || !data.secure_url) throw new Error('subida')
  // Versión optimizada: formato y calidad automáticos, máx. 1200 px.
  return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
}

const campo = 'h-12 w-full rounded-xl border border-borde bg-white px-4 text-base outline-none focus:ring-2 focus:ring-rosa/30'
const boton = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-medium transition disabled:opacity-50'

function Aviso({ aviso }) {
  if (!aviso) return null
  return (
    <p role="status" className={`rounded-xl px-4 py-3 text-sm ${aviso.error ? 'bg-peligro/10 text-peligro' : 'bg-whatsapp/10 text-whatsapp'}`}>
      {aviso.texto}
    </p>
  )
}

export default function AdminProductos() {
  const [usuario, setUsuario] = useState(undefined)
  useEffect(() => onAuthStateChanged(auth, setUsuario), [])
  if (usuario === undefined) return <Cargando />
  return usuario ? <Panel usuario={usuario} /> : <Login />
}

function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [cargando, setCargando] = useState(false)
  const [aviso, setAviso] = useState(null)

  const entrar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setAviso(null)
    try {
      await signInWithEmailAndPassword(auth, correo.trim(), clave)
    } catch {
      setAviso({ error: true, texto: 'Correo o contraseña incorrectos.' })
    }
    setCargando(false)
  }

  const recuperar = async () => {
    if (!correo.trim()) return setAviso({ error: true, texto: 'Escribe tu correo arriba y vuelve a tocar "Olvidé mi contraseña".' })
    try {
      await sendPasswordResetEmail(auth, correo.trim())
      setAviso({ texto: 'Te enviamos un correo para crear una contraseña nueva. Revisa también la carpeta de spam.' })
    } catch {
      setAviso({ error: true, texto: 'No pudimos enviar el correo. Revisa que esté bien escrito.' })
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <div className="text-center"><Logo className="text-3xl" /></div>
      <h1 className="mt-4 text-center text-4xl">Panel de la tienda</h1>
      <form onSubmit={entrar} className="mt-8 space-y-4">
        <label className="block"><span className="mb-1 block text-sm">Correo</span>
          <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className={campo} autoComplete="email" />
        </label>
        <label className="block"><span className="mb-1 block text-sm">Contraseña</span>
          <input type="password" required value={clave} onChange={(e) => setClave(e.target.value)} className={campo} autoComplete="current-password" />
        </label>
        <Aviso aviso={aviso} />
        <button disabled={cargando} className={`${boton} w-full bg-rosa text-white`}>{cargando ? 'Un momento…' : 'Entrar'}</button>
      </form>
      <button onClick={recuperar} className="mt-6 w-full text-center text-sm text-rosa underline">Olvidé mi contraseña</button>
    </div>
  )
}

function Panel({ usuario }) {
  const { productos, cargando, recargar } = useProductos()
  const [editando, setEditando] = useState(null)
  const [aviso, setAviso] = useState(null)

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}" de la tienda? Esto no se puede deshacer.`)) return
    try {
      await deleteDoc(doc(db, 'productos', p.id))
      setAviso({ texto: 'Producto eliminado.' })
      recargar()
    } catch {
      setAviso({ error: true, texto: 'No se pudo eliminar. Puede que esta cuenta no tenga permiso.' })
    }
  }

  if (editando)
    return (
      <Formulario
        producto={editando === 'nuevo' ? null : editando}
        alCerrar={(texto) => { setEditando(null); if (texto) { setAviso({ texto }); recargar() } }}
      />
    )

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Mis productos</h1>
        <button onClick={() => signOut(auth)} className="inline-flex items-center gap-2 text-sm text-suave hover:text-tinta">
          <Icono n="salir" className="h-4 w-4" /> Salir ({usuario.email})
        </button>
      </div>
      <button onClick={() => setEditando('nuevo')} className={`${boton} mt-6 h-14 w-full bg-rosa text-lg text-white sombra-alta sm:w-auto`}>
        <Icono n="mas" /> Agregar producto
      </button>
      <div className="mt-4"><Aviso aviso={aviso} /></div>

      {cargando ? <Cargando /> : productos.length === 0 ? (
        <p className="mt-10 text-suave">Todavía no hay productos. Toca "Agregar producto" para crear el primero.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {productos.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 rounded-2xl bg-white p-3 sombra sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                {p.fotos?.[0] ? <img src={p.fotos[0]} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="h-20 w-20 shrink-0 rounded-xl bg-acento" />}
                <div className="min-w-0">
                  <p className="font-medium leading-tight">{p.nombre}</p>
                  <p className="mt-1 text-sm text-suave">
                    {formatCLP(precioFinal(p))} · {p.stock > 0 ? `Stock: ${p.stock}` : <span className="text-peligro">Agotado</span>}
                    {p.destacado && ' · ★ Destacado'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditando(p)} className={`${boton} flex-1 border border-borde bg-fondo`}><Icono n="lapiz" className="h-4 w-4" /> Editar</button>
                <button onClick={() => eliminar(p)} className={`${boton} flex-1 bg-peligro/10 text-peligro`}><Icono n="basura" className="h-4 w-4" /> Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const soloNumeros = (s) => parseInt(String(s).replace(/\D/g, ''), 10)

function Formulario({ producto, alCerrar }) {
  const [f, setF] = useState({
    nombre: producto?.nombre ?? '',
    marca: producto?.marca ?? '',
    categoria: producto?.categoria ?? CATEGORIAS[0],
    precio: producto?.precio?.toString() ?? '',
    oferta: producto?.oferta ? producto.oferta.toString() : '',
    descripcion: producto?.descripcion ?? '',
    stock: producto?.stock?.toString() ?? '1',
    destacado: producto?.destacado ?? false,
  })
  const [fotos, setFotos] = useState(producto?.fotos ?? [])
  const [subiendo, setSubiendo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const subir = async (files) => {
    const lista = Array.from(files || [])
    if (!lista.length) return
    setSubiendo(true)
    setAviso(null)
    const nuevas = []
    for (const file of lista) {
      if (!file.type.startsWith('image/') || file.size > 15 * 1024 * 1024) {
        setAviso({ error: true, texto: `"${file.name}" no es una foto o pesa más de 15 MB.` })
        continue
      }
      try { nuevas.push(await subirFoto(file)) } catch { setAviso({ error: true, texto: `No se pudo subir "${file.name}". Intenta de nuevo.` }) }
    }
    setFotos((s) => [...s, ...nuevas])
    setSubiendo(false)
  }

  const moverAPrincipal = (i) => setFotos((s) => [s[i], ...s.filter((_, j) => j !== i)])

  const guardar = async (e) => {
    e.preventDefault()
    const precio = soloNumeros(f.precio)
    const oferta = f.oferta.trim() ? soloNumeros(f.oferta) : null
    const stock = soloNumeros(f.stock)
    if (!f.nombre.trim()) return setAviso({ error: true, texto: 'Escribe el nombre del producto.' })
    if (!(precio > 0)) return setAviso({ error: true, texto: 'Escribe un precio válido, solo números (ej: 12990).' })
    if (oferta !== null && !(oferta > 0 && oferta < precio)) return setAviso({ error: true, texto: 'El precio de oferta debe ser menor que el precio normal.' })
    if (isNaN(stock) || stock < 0) return setAviso({ error: true, texto: 'El stock debe ser 0 o más.' })

    setGuardando(true)
    const datos = {
      nombre: f.nombre.trim(), marca: f.marca.trim(), categoria: f.categoria, precio, oferta,
      descripcion: f.descripcion.trim(), stock, destacado: f.destacado, fotos,
    }
    try {
      if (producto) await updateDoc(doc(db, 'productos', producto.id), datos)
      else await addDoc(productosRef, { ...datos, creado: serverTimestamp() })
      alCerrar(producto ? '¡Cambios guardados!' : '¡Producto agregado!')
    } catch {
      setAviso({ error: true, texto: 'No se pudo guardar. Revisa tu conexión o que esta cuenta tenga permiso.' })
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="mx-auto max-w-2xl space-y-5 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">{producto ? 'Editar producto' : 'Nuevo producto'}</h1>
        <button type="button" onClick={() => alCerrar()} className="rounded-full p-2 hover:bg-acento" aria-label="Volver sin guardar"><Icono n="cerrar" className="h-6 w-6" /></button>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Fotos <span className="font-normal text-suave">(la primera es la principal; toca otra para ponerla primero)</span></span>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {fotos.map((src, i) => (
            <div key={src + i} className="relative aspect-square overflow-hidden rounded-xl bg-acento">
              <button type="button" onClick={() => moverAPrincipal(i)} className="h-full w-full" aria-label={i === 0 ? 'Foto principal' : `Usar foto ${i + 1} como principal`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
              {i === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 text-[10px]">Principal</span>}
              <button type="button" onClick={() => setFotos(fotos.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-white/90 p-1" aria-label="Quitar foto"><Icono n="cerrar" className="h-4 w-4" /></button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-borde text-center text-sm text-suave hover:bg-acento">
            <Icono n="foto" className="h-6 w-6" />
            {subiendo ? 'Subiendo…' : 'Agregar fotos'}
            <input type="file" accept="image/*" multiple className="sr-only" disabled={subiendo} onChange={(e) => { subir(e.target.files); e.target.value = '' }} />
          </label>
        </div>
      </div>

      <label className="block"><span className="mb-1 block text-sm font-medium">Nombre *</span>
        <input value={f.nombre} onChange={(e) => set('nombre', e.target.value)} className={campo} required /></label>
      <label className="block"><span className="mb-1 block text-sm font-medium">Marca</span>
        <input value={f.marca} onChange={(e) => set('marca', e.target.value)} className={campo} /></label>
      <label className="block"><span className="mb-1 block text-sm font-medium">Categoría</span>
        <select value={f.categoria} onChange={(e) => set('categoria', e.target.value)} className={campo}>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select></label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block"><span className="mb-1 block text-sm font-medium">Precio *</span>
          <input inputMode="numeric" placeholder="12990" value={f.precio} onChange={(e) => set('precio', e.target.value)} className={campo} required /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium">Precio oferta</span>
          <input inputMode="numeric" placeholder="Opcional" value={f.oferta} onChange={(e) => set('oferta', e.target.value)} className={campo} /></label>
      </div>
      <label className="block"><span className="mb-1 block text-sm font-medium">Descripción</span>
        <textarea rows={5} value={f.descripcion} onChange={(e) => set('descripcion', e.target.value)} className={`${campo} h-auto py-3`} /></label>
      <label className="block"><span className="mb-1 block text-sm font-medium">Stock (unidades disponibles; 0 = agotado)</span>
        <input type="number" min={0} inputMode="numeric" value={f.stock} onChange={(e) => set('stock', e.target.value)} className={campo} /></label>
      <fieldset>
        <legend className="mb-2 block text-sm font-medium">¿Destacado en el inicio?</legend>
        <div className="flex gap-3">
          {[true, false].map((v) => (
            <button key={String(v)} type="button" aria-pressed={f.destacado === v} onClick={() => set('destacado', v)} className={`${boton} flex-1 border ${f.destacado === v ? 'border-rosa bg-rosa text-white' : 'border-borde bg-white'}`}>
              {v ? 'Sí' : 'No'}
            </button>
          ))}
        </div>
      </fieldset>
      <Aviso aviso={aviso} />
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => alCerrar()} className={`${boton} flex-1 border border-borde`}>Cancelar</button>
        <button disabled={guardando || subiendo} className={`${boton} flex-[2] bg-rosa text-white sombra-alta`}>{guardando ? 'Guardando…' : 'Guardar producto'}</button>
      </div>
    </form>
  )
}
