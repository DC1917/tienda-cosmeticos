import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './Catalogo'
import DetalleProducto from './DetalleProducto'
import AdminProductos from './AdminProductos'
import Carrito from './Carrito'
import Header from './Header'
import { CartProvider } from './CartContext'

function StoreLayout() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/*" element={<StoreLayout />} />
          <Route path="/admin" element={<AdminProductos />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App