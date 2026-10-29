import { useEffect } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { Footer, Header, WhatsAppFlotante } from './ui'
import Inicio from './Inicio'
import Catalogo from './Catalogo'
import DetalleProducto from './DetalleProducto'
import Carrito from './Carrito'
import AdminProductos from './AdminProductos'

function Tienda() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <WhatsAppFlotante />
    </>
  )
}

function NoEncontrado() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-4xl">Página no encontrada</h1>
      <Link to="/" className="mt-4 inline-block text-rosa underline">Volver al inicio</Link>
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Tienda />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="*" element={<NoEncontrado />} />
          </Route>
          <Route path="/admin" element={<AdminProductos />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
