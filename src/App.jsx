import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './Catalogo'
import DetalleProducto from './DetalleProducto'
import AdminProductos from './AdminProductos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/admin" element={<AdminProductos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App