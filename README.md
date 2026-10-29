# Vale Cosmética · tienda de perfumes y cosméticos

Catálogo con carrito y pedido por WhatsApp, más un panel (`/admin`) para que la dueña administre productos, precios, stock y fotos.
React + Vite + Tailwind 4, Firebase (Firestore + Auth con correo/contraseña), fotos en Cloudinary, hosting en Firebase.

## Datos de la tienda
Nombre, eslogan, WhatsApp e Instagram: `src/tienda.js`. Categorías: misma archivo.
Quién puede administrar: lista de correos en `firestore.rules` (`esAdmin`). Las cuentas se crean en la consola de Firebase → Authentication → Usuarios.

## Comandos
```
npm install
npm run dev        # local
npm test           # pruebas de precios, total y mensaje de WhatsApp
npm run deploy     # compila y publica hosting + reglas (requiere firebase login)
node scripts/cargar-ejemplos.mjs   # agrega los 10 productos de ejemplo
```
El `.env` (claves `VITE_FIREBASE_*`) no se sube; hay copia en el respaldo privado.
