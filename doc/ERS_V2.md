# ERS — Especificación de Requisitos del Software (V2)

**Proyecto:** La Taberna de Snorlax — Tienda online de cervecería
**Asignatura:** DSY1104 — Desarrollo Fullstack II
**Versión del documento:** V2 (Evaluación Parcial 2 — entrega de encargo)
**Fecha:** ___/___/2026
**Equipo:** *(completar con nombres de los integrantes, máx. 3)*

| Versión | Fecha | Cambios |
|---|---|---|
| V1 | Evaluación Parcial 1 | Tienda en HTML/CSS/JS/Bootstrap-style, carrito en JS, CRUD en localStorage |
| V2 | Evaluación Parcial 2 | Migración a React, nuevas vistas (categorías, ofertas, checkout, resultados de compra, administración), archivo de datos con CRUD, pruebas unitarias con Jasmine + Karma |

---

## 1. Descripción general

Se actualiza la tienda online "La Taberna de Snorlax" migrando el frontend de
HTML/CSS/JavaScript puro a una aplicación **SPA en React**, manteniendo la
persistencia de datos en el navegador (`localStorage`) mediante un archivo de
datos simulado con operaciones CRUD. Se incorpora un flujo de compra completo
(carrito → checkout → confirmación o rechazo del pago) y un panel de
administración para gestionar el inventario.

## 2. Alcance (nuevo en V2)

1. Migración de las páginas existentes a **componentes React reutilizables**.
2. Nuevas vistas: **Categorías, Ofertas, Checkout, Compra exitosa, Compra fallida**.
3. Panel de **administración** con CRUD completo del inventario.
4. **Diseño responsivo con Bootstrap 5** (móvil, tableta, escritorio).
5. **Pruebas unitarias** de los componentes con **Jasmine + Karma**.

## 3. Usuarios (actores)

- **Visitante:** navega, busca y filtra productos, se registra e inicia sesión.
- **Cliente con sesión:** compra con el carrito y su dirección se autocompleta en el checkout.
- **Administrador:** crea, edita y elimina productos del inventario.

## 4. Requisitos funcionales

### 4.1 Catálogo y persistencia

| ID | Requisito |
|---|---|
| RF-01 | El sistema mostrará el inventario de productos (nombre, estilo, descripción, precio, imagen, categoría y descuento). |
| RF-02 | `src/data/inventarioStore.js` funcionará como **fuente de datos simulada** con operaciones **CRUD**: `crearProducto`, `obtenerProductos`, `actualizarProducto`, `eliminarProducto` y `restaurarInventario`. |
| RF-03 | Los datos se persistirán en `localStorage` y sobrevivirán a la recarga de la página. |
| RF-04 | Cualquier cambio en el inventario notificará a los componentes suscritos, actualizando la interfaz **en tiempo real** (sin recargar). |
| RF-05 | La búsqueda por nombre/estilo y el filtro por categoría se aplicarán sobre el inventario actual. |
| RF-26 | Al hacer clic en **"Ver detalles"** se abrirá un **popup (modal)** con el detalle del producto **sin cambiar de ruta**; el enlace conservará su `href` (Ctrl/Cmd + clic abre la pestaña con la página completa) y la ruta `/productos/:id` seguirá disponible para acceso directo/recarga. |

### 4.2 Carrito y compra

| ID | Requisito |
|---|---|
| RF-06 | El usuario podrá agregar, restar y eliminar ítems del carrito; el contador del navbar se actualizará en tiempo real. |
| RF-07 | El **checkout** solicitará: nombre, correo, tipo de entrega (domicilio/retiro), dirección, comuna y método de pago. |
| RF-08 | Si existe sesión iniciada, el checkout **autocompletará** nombre, correo, dirección y comuna. |
| RF-09 | El sistema validará los campos del checkout antes de procesar el pago y mostrará mensajes de error inline. |
| RF-10 | Tras pagar, se generará un **resumen de compra** (ítems, total, datos de entrega, fecha y estado). |
| RF-11 | Si el pago es aprobado se mostrará la vista de **compra exitosa** y el carrito se vaciará. |
| RF-12 | Si el pago es rechazado se mostrará la vista de **compra fallida** y el carrito **se conservará** para reintentar. |

### 4.3 Sesión y validaciones

| ID | Requisito |
|---|---|
| RF-13 | Registro de usuario con validación de nombre, correo (dominios `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`), contraseña (4–10 caracteres), repetición de contraseña y mayoría de edad. |
| RF-14 | Inicio y cierre de sesión persistido; el navbar mostrará el estado correspondiente. |
| RF-15 | Formulario de contacto validado (nombre, correo, asunto y mensaje ≥ 10 caracteres). |

### 4.4 Administración

| ID | Requisito |
|---|---|
| RF-16 | El administrador podrá **crear** productos con nombre, estilo, categoría, precio, descuento, imagen y descripción. |
| RF-17 | El administrador podrá **editar** productos existentes (carga los datos en el formulario). |
| RF-18 | El administrador podrá **eliminar** productos con confirmación previa. |
| RF-19 | Se mostrarán KPIs: cantidad de productos, cantidad en oferta y valor del inventario. |

### 4.5 Socios, ofertas del día y acceso administración

| ID | Requisito |
|---|---|
| RF-21 | El acceso a `/admin` estará **protegido** por el componente `AdminLock` con 3 estados: sin sesión → redirigirá a `/login` recordando la ruta de origen; con sesión pero **sin rol administrador** → redirigirá al home; solo el rol `admin` verá el panel. |
| RF-22 | Solo los usuarios con sesión iniciada ("socios") verán las **ofertas del día**: 3 productos seleccionados de forma determinista según la fecha, con un **-10% adicional** aplicado en catálogo, detalle, carrito y total. |
| RF-23 | El descuento de socio **no se persiste en el carrito**: se calculará al momento de mostrar, de modo que si el producto sale de la oferta del día su precio se revierte sin perder los ítems. |
| RF-24 | Credenciales por defecto: `admin@duoc.cl`/`admin123` (administrador) y `cliente@duoc.cl`/`cliente123` (cliente socio); el login validará contra `usuariosStore` y mostrará error con credenciales incorrectas. |
| RF-25 | El link **"Administración"** del navbar **solo se mostrará** a usuarios con sesión y rol administrador (`esAdmin()` consulta `usuariosStore`; fallo cerrado para correos desconocidos). |

### 4.6 Pruebas

| ID | Requisito |
|---|---|
| RF-20 | El proyecto incluirá **pruebas unitarias** ejecutadas con **Jasmine + Karma** que cubran: renderizado, renderizado condicional, manejo de props, estado, eventos y la lógica de CRUD/validaciones. |

## 5. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | **Responsividad:** el diseño se adaptará a móvil, tableta y escritorio usando Bootstrap 5 (clases `col-*`, `row`, `container`). |
| RNF-02 | **Rendimiento:** la app se sirve como SPA estática; el build de producción pesa ~291 KB JS + 234 KB CSS (gzip ~122 KB). |
| RNF-03 | **Compatibilidad:** navegadores modernos con soporte de ES2020+ y JavaScript habilitado. |
| RNF-04 | **Separación de capas:** UI (components/pages), lógica (utils), datos (data/stores). |
| RNF-05 | **Consistencia de componentes:** navbar y footer reutilizados en todas las vistas. |

## 6. Modelo de datos

```
Producto {
  id: number, nombre: string, estilo: string, descripcion: string,
  precio: number, imagen: string, categoria: string, descuento: number
}

ItemCarrito {
  id: number, nombre: string, imagen: string,
  precio: number, precioFinal: number, cantidad: number
}

Sesion { nombre: string, email: string, direccion: string, comuna: string }

Usuario {
  nombre: string, email: string, password: string,
  rol: "admin" | "cliente"
}

ResumenCompra {
  fecha: string, items: ItemCarrito[], total: number,
  datos: {...}, estado: "aprobada" | "rechazada"
}
```

Llaves en `localStorage`: `inventarioTaberna`, `carritoTaberna`,
`sesionTaberna`, `usuariosTaberna`, `resumenCompra`.

## 7. Flujo de navegación

```
Home ─┬─ Productos ─→ Carrito ─→ Checkout ─┬─ Compra exitosa (resumen)
      ├─ Categorías                        └─ Compra fallida ─→ Carrito (reintentar)
      ├─ Ofertas
      ├─ Contacto
      ├─ Login ⇄ Registro
      └─ Admin (CRUD inventario)   [requiere sesión + rol admin]
```

## 8. Criterios de aceptación

1. `npm run dev` levanta la aplicación sin errores y todas las vistas son navegables.
2. `npm run build` genera el build de producción sin errores.
3. `npm test` ejecuta las pruebas Jasmine + Karma con **57/57 aprobadas**.
4. Los datos del inventario, carrito y sesión persisten tras recargar la página.
5. Las vistas nuevas (categorías, ofertas, checkout, resultados) funcionan según RF-05 a RF-12.
