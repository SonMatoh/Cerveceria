# 🍺 La Taberna de Snorlax — Cervecería (React)

Proyecto de la asignatura **DSY1104 — Desarrollo Fullstack II**.
Actualización del proyecto de la Evaluación Parcial 1 (tienda en HTML/CSS/JS)
a **React**, según los requerimientos de la **Evaluación Parcial 2**.

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework frontend | React 18 + React Router 6 |
| Build / bundler | Vite 6 |
| Diseño responsivo | **Bootstrap 5** |
| Persistencia | `localStorage` vía *stores* con suscripción (base de datos simulada + CRUD) |
| Pruebas unitarias | **Jasmine + Karma** (+ Testing Library, Webpack/Babel para empaquetar specs) |

## Requerimientos cubiertos (Anexo 1)

- ✅ Migración de HTML a **componentes React** reutilizables (props + estado).
- ✅ **Archivo de datos en JavaScript** con operaciones CRUD (`src/data/inventarioStore.js`).
- ✅ **Persistencia conectada a React** con `useSyncExternalStore` (actualiza la UI en tiempo real).
- ✅ Diseño **responsivo con Bootstrap**.
- ✅ **Vistas nuevas**: Categorías, Ofertas, Checkout (paso de pago), Compra exitosa, Compra fallida y Panel de administración.
- ✅ **Interactividad**: búsqueda, filtros, formularios validados, carrito y navegación.
- ✅ **Detalle en popup**: "Ver detalles" abre un **modal en la misma página** (sin cambiar de ruta); la ruta `/productos/:id` queda para acceso directo.
- ✅ **Pruebas unitarias con Jasmine + Karma** (57 pruebas: renderizado, props, estado, eventos, lógica y CRUD).
- ✅ **Panel de administración protegido** con `AdminLock` (sin sesión → login; sesión sin rol admin → home).
- ✅ **Ofertas del día para socios**: -10% extra en 3 productos (según la fecha) para usuarios con sesión.

## Estructura del proyecto

```
Cerveceria-React/
├── index.html
├── vite.config.js
├── karma.conf.cjs          # configuración Jasmine + Karma + Webpack
├── public/imagenes/        # imágenes de productos
├── src/
│   ├── main.jsx            # punto de entrada (Bootstrap + BrowserRouter + App)
│   ├── App.jsx             # rutas de la SPA
│   ├── styles/global.css   # estilos propios sobre Bootstrap
│   ├── components/
│   │   ├── atoms/          # Text, Image, Button, Input
│   │   ├── molecules/      # Texts, CardBody, FormField, CartItem
│   │   ├── organisms/      # Navbar, Footer, ProductCard
│   │   └── templates/      # PageTemplate, AdminLock (guard de /admin)
│   ├── pages/              # Home, Productos, ProductDetail, Categorías,
│   │                       # Ofertas, Carrito, Checkout, CompraExitosa,
│   │                       # CompraFallida, Contacto, Login, Registro, Admin
│   ├── data/               # inventarioStore (CRUD), carritoStore,
│   │                       # sesionStore, usuariosStore
│   ├── hooks/              # useStore (conexión React ↔ persistencia)
│   ├── utils/              # validaciones, imagenes, socios
│   └── test/               # specs Jasmine (setupTests + atoms/molecules/
│                           # organisms/pages/data/utils)
└── doc/                    # ERS V2 y cobertura de testing
```

## Comandos

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm run build   # build de producción en dist/
npm run preview # servir el build de producción
npm test        # ejecutar las pruebas Jasmine + Karma (single run)
npm run test:watch  # pruebas en modo watch
```

## Rutas de la aplicación

| Ruta | Vista |
|---|---|
| `/` | Home (portada + destacados + video) |
| `/productos` | Listado con búsqueda y filtro por categoría |
| `/categorias` | Productos agrupados por categoría |
| `/ofertas` | Productos con descuento |
| `/carrito` | Carrito de compras |
| `/checkout` | Paso de pago (dirección + método de pago) |
| `/compra-exitosa` | Confirmación + resumen de la compra |
| `/compra-fallida` | Pago rechazado (conserva el carrito) |
| `/contacto` | Formulario con validaciones |
| `/login` · `/registro` | Sesión de usuario |
| `/admin` | Panel administrativo (CRUD de productos) — **protegido por `AdminLock`** |

## Acceso al panel de administración

| Credencial | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duoc.cl` | `admin123` |
| Cliente (socio) | `cliente@duoc.cl` | `cliente123` |

- `/admin` está protegido: **sin sesión redirige a `/login`** y, tras autenticarse,
  devuelve al usuario a la ruta que intentaba abrir.
- **Solo el rol administrador** (`admin@duoc.cl`) ve el link *Administración* en el
  navbar y accede al panel; los demás usuarios con sesión son **redirigidos al home**.
- Al registrar un usuario nuevo desde `/registro` también queda habilitado para iniciar sesión.

## Ofertas del día (descuentos para socios)

- Solo los usuarios con sesión iniciada ("socios") ven las ofertas del día.
- Cada día se seleccionan **3 productos** (rotación determinista según la fecha,
  sin aleatoriedad) con un **-10% adicional** sobre su precio actual.
- El descuento **no se guarda**: se aplica al mostrar (catálogo, detalle, carrito
  y total). Si un producto deja de estar en la oferta, su precio vuelve a la
  normalidad **sin perder los artículos del carrito**.

## Documentos de entrega

- [doc/ERS_V2.md](doc/ERS_V2.md) — Especificación de Requisitos del Software (V2).
- [doc/cobertura-testing.md](doc/cobertura-testing.md) — Documento de cobertura de testing.
