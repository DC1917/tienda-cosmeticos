import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CLAVE = 'carrito_cosmeticos'

function leer() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || [] } catch { return [] }
}

export function CartProvider({ children }) {
  const [lineas, setLineas] = useState(leer)

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(lineas)) } catch { /* modo privado */ }
  }, [lineas])

  const agregar = (item) =>
    setLineas((ls) => {
      const existe = ls.find((l) => l.id === item.id)
      if (!existe) return [...ls, { ...item, cantidad: Math.min(item.cantidad, item.stock) }]
      return ls.map((l) => (l.id === item.id ? { ...l, cantidad: Math.min(l.cantidad + item.cantidad, item.stock) } : l))
    })

  const cambiarCantidad = (id, cantidad) =>
    setLineas((ls) =>
      cantidad <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, cantidad: Math.min(cantidad, l.stock) } : l))
    )

  const quitar = (id) => setLineas((ls) => ls.filter((l) => l.id !== id))
  const cantidad = lineas.reduce((s, l) => s + l.cantidad, 0)

  return (
    <CartContext.Provider value={{ lineas, agregar, cambiarCantidad, quitar, cantidad }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook junto a su provider
export const useCart = () => useContext(CartContext)
