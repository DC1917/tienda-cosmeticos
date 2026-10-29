// Datos de la tienda: cámbialos aquí.
export const STORE = {
  nombre: 'Vale',
  apellido: 'Cosmética',
  slogan: 'Belleza que te hace brillar',
  whatsapp: '56912345678',
  instagram: 'valecosmetica',
}
export const NOMBRE = `${STORE.nombre} ${STORE.apellido}`

export const CATEGORIAS = ['Perfumes', 'Maquillaje', 'Cuidado de la piel', 'Cuidado capilar', 'Sets de regalo']

// 12990 -> "$12.990"
export function formatCLP(valor) {
  return '$' + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function precioFinal(p) {
  return p.oferta > 0 && p.oferta < p.precio ? p.oferta : p.precio
}

export function enOferta(p) {
  return precioFinal(p) < p.precio
}

export function totalCarrito(lineas) {
  return lineas.reduce((s, l) => s + l.precio * l.cantidad, 0)
}

export function mensajePedido(lineas) {
  return [
    `¡Hola ${NOMBRE}! Quiero hacer este pedido:`,
    '',
    ...lineas.map((l) => `• ${l.cantidad} x ${l.nombre}${l.marca ? ` (${l.marca})` : ''}: ${formatCLP(l.precio * l.cantidad)}`),
    '',
    `Total: ${formatCLP(totalCarrito(lineas))}`,
    '',
    '¿Me confirmas disponibilidad y forma de entrega? ¡Gracias!',
  ].join('\n')
}

export function whatsappUrl(texto) {
  const base = `https://wa.me/${STORE.whatsapp}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
