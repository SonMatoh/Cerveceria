# 🍺 La Taberna de Snorlax

Tienda online de cervezas inspiradas en el Mundo Pokémon.

## Integrantes

- Sergio Cerda
- Mateo Hormaeche
- Matias Contreras

## Stack

| Tecnología | Versión |
|---|---|
| React | 18.3.1 |
| Vite | 6.3.5 |
| React Router | 6.30.0 |
| React Bootstrap | 2.10.10 |
| Bootstrap | 5.3.3 |
| React Hook Form | 7.54.2 |

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