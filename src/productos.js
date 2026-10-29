import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export const productosRef = collection(db, 'productos')

export async function cargarProductos() {
  const snap = await getDocs(query(productosRef, orderBy('creado', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function useProductos() {
  const [estado, setEstado] = useState({ productos: [], cargando: true, error: false })
  const recargar = () =>
    cargarProductos()
      .then((productos) => setEstado({ productos, cargando: false, error: false }))
      .catch(() => setEstado((s) => ({ ...s, cargando: false, error: true })))
  useEffect(() => { recargar() }, [])
  return { ...estado, recargar }
}

export function useProducto(id) {
  const [estado, setEstado] = useState({ producto: null, cargando: true })
  useEffect(() => {
    getDoc(doc(db, 'productos', id))
      .then((d) => setEstado({ producto: d.exists() ? { id: d.id, ...d.data() } : null, cargando: false }))
      .catch(() => setEstado({ producto: null, cargando: false }))
  }, [id])
  return estado
}
