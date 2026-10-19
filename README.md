# 🍺 La Taberna de Snorlax

Tienda online de cervezas inspiradas en el Mundo Pokémon.

## Integrantes

- Sergio Cerda
- Mateo Hormaeche
- Matias Contreras

## Estructura

```
src/
├── components/          13 componentes
│   ├── atoms/           Text, Input, Image, Button
│   ├── molecules/       Texts, FormField, CartItem, CardBody
│   ├── organisms/       ProductCard, Navbar, Footer
│   └── templates/       PageTemplate, AdminLock
│
├── pages/               16 páginas
├── data/
│   └── Products.js      estado global y localStorage
├── test/                pruebas unitarias
├── App.jsx
└── main.jsx
```

## Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo

```

## Requisitos

- Node.js 18 o superior
- Navegador (Chrome o Edge)

## Estado y navegación

El estado de la aplicación se centraliza en `src/data/Products.js`, que persiste
en `localStorage`:

- Carrito de compras
- Sesión del usuario
- Inventario de productos
- Registro de usuarios

Los permisos de administración se controlan con el campo `rol` del usuario. La
ruta `/admin` está protegida por el componente `AdminLock`.
