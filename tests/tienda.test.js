import assert from 'node:assert/strict'
import { formatCLP, precioFinal, enOferta, totalCarrito, mensajePedido } from '../src/tienda.js'

assert.equal(formatCLP(12990), '$12.990')
assert.equal(formatCLP(1234567), '$1.234.567')
assert.equal(formatCLP(990), '$990')

assert.equal(precioFinal({ precio: 10000, oferta: 8000 }), 8000)
assert.equal(precioFinal({ precio: 10000, oferta: 12000 }), 10000) // oferta mayor no cuenta
assert.equal(precioFinal({ precio: 10000, oferta: null }), 10000)
assert.equal(enOferta({ precio: 10000, oferta: 0 }), false)

const lineas = [{ nombre: 'Labial', marca: 'X', precio: 5000, cantidad: 2 }, { nombre: 'Crema', precio: 3000, cantidad: 1 }]
assert.equal(totalCarrito(lineas), 13000)
assert.match(mensajePedido(lineas), /2 x Labial \(X\): \$10\.000/)
assert.match(mensajePedido(lineas), /Total: \$13\.000/)

console.log('tienda.test.js OK')
