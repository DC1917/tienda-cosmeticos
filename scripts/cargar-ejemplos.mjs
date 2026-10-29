// Carga los 10 productos de ejemplo en Firestore usando la sesión de `firebase login`.
// Uso: node scripts/cargar-ejemplos.mjs   (no borra nada; agrega documentos nuevos)
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'

const PROYECTO = 'tienda-cosmeticos-95005'
const token = JSON.parse(readFileSync(`${homedir()}/.config/configstore/firebase-tools.json`, 'utf8')).tokens.access_token
const u = (id) => `https://images.unsplash.com/photo-${id}?w=1000&q=80`

const productos = [
  ['Eau de Parfum Rosé Élégance 50 ml', 'Maison Lumière', 'Perfumes', 49990, 42990, 'Fragancia floral con notas de rosa damascena, peonía y almizcle blanco. Elegante, femenina y de larga duración.', 8, true, ['1608571423902-eed4a5ad8108']],
  ['Perfume Vainilla Dorada 100 ml', 'Aurora', 'Perfumes', 39990, null, 'Notas gourmand de vainilla de Madagascar, haba tonka y ámbar. Un aroma cálido y envolvente.', 5, true, ['1617897903246-719242758050']],
  ['Body Mist Flor de Azahar 236 ml', 'Bloom', 'Perfumes', 12990, 9990, 'Bruma corporal fresca y ligera con azahar y cítricos. Perfecta para llevar en la cartera.', 15, false, ['1608248543803-ba4f8c70ae0b']],
  ['Labial Mate Nude Rosado', 'Velvet Kiss', 'Maquillaje', 8990, null, 'Acabado mate aterciopelado, cómodo y de larga duración. Tono nude rosado que favorece a todas las pieles.', 20, true, ['1512496015851-a90fb38ba796']],
  ['Labial Cremoso Rojo Clásico', 'Velvet Kiss', 'Maquillaje', 7990, 5990, 'Rojo intenso de textura cremosa e hidratante, con vitamina E.', 0, false, ['1631730486784-5456119f69ae']],
  ['Base Líquida Luminosa FPS 15', 'Glow Studio', 'Maquillaje', 19990, null, 'Cobertura media con acabado luminoso y natural. Unifica el tono y protege del sol.', 10, false, ['1596462502278-27bfdc403348']],
  ['Sérum Vitamina C 30 ml', 'Pure Skin', 'Cuidado de la piel', 24990, 19990, 'Sérum antioxidante con 15% de vitamina C que ilumina y unifica el tono. Uso diario por la mañana.', 12, true, ['1620916566398-39f1143ab7be']],
  ['Crema Hidratante Ácido Hialurónico 50 ml', 'Pure Skin', 'Cuidado de la piel', 17990, null, 'Crema facial ligera que hidrata en profundidad durante 24 horas. Apta para todo tipo de piel.', 9, false, ['1601049541289-9b1b7bbbfe19', '1599305090598-fe179d501227']],
  ['Aceite Capilar Argán 50 ml', 'Seda', 'Cuidado capilar', 5990, null, 'Aceite nutritivo de argán que controla el frizz y aporta brillo sin engrasar.', 25, false, ['1599305090598-fe179d501227']],
  ['Set de Regalo Glow Esencial', 'Vale Cosmética', 'Sets de regalo', 34990, 29990, 'Caja de regalo con sérum vitamina C, labial mate nude y body mist. El regalo perfecto.', 6, true, ['1596462502278-27bfdc403348', '1512496015851-a90fb38ba796']],
]

const valor = (v) =>
  v === null ? { nullValue: null }
  : typeof v === 'number' ? { integerValue: String(v) }
  : typeof v === 'boolean' ? { booleanValue: v }
  : Array.isArray(v) ? { arrayValue: { values: v.map(valor) } }
  : { stringValue: v }

for (const [i, [nombre, marca, categoria, precio, oferta, descripcion, stock, destacado, fotos]] of productos.entries()) {
  const datos = { nombre, marca, categoria, precio, oferta, descripcion, stock, destacado, fotos: fotos.map(u) }
  const fields = Object.fromEntries(Object.entries(datos).map(([k, v]) => [k, valor(v)]))
  fields.creado = { timestampValue: new Date(Date.now() - i * 60000).toISOString() }
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROYECTO}/databases/(default)/documents/productos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
  console.log(res.ok ? 'OK ' : 'ERROR ', nombre, res.ok ? '' : await res.text())
}
