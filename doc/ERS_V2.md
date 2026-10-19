# Especificación de Requisitos de Software (ERS) — Versión 2

| Campo | Valor |
|---|---|
| **Nombre del Proyecto** | La Taberna de Snorlax — Tienda Online en React |
| **Asignatura** | DSY1104 — Desarrollo Fullstack II |
| **Institución** | Duoc UC — Escuela de Informática y Telecomunicaciones |
| **Repositorio GitHub** | https://github.com/SonMatoh/Cerveceria.git |
| **Versión del Documento** | 2.0 (Migración a Frontend React y Flujos Completos) |
| **Fecha** | 18/10/2026 |
| **Integrantes** | Sergio Cerda · Mateo Hormaeche · Matias Contreras |

---

## 1. Introducción y Propósito

El presente documento de Especificación de Requerimientos de Software (ERS
Versión 2) define los requerimientos funcionales, no funcionales, la
arquitectura de componentes y las herramientas utilizadas para la evolución de
la tienda online "La Taberna de Snorlax".

En esta segunda etapa del proyecto, se realizó la migración completa desde las
maquetas estáticas en HTML/CSS/JS hacia una aplicación web de página única
(SPA — Single Page Application) utilizando el framework React, incorporando
diseño responsivo con Bootstrap, persistencia de datos en tiempo real mediante
LocalStorage, un archivo simulador de base de datos con operaciones CRUD, nuevos
flujos de navegación públicos y administrativos, y pruebas unitarias
automatizadas con Karma y Jasmine.

---

## 2. Arquitectura del Frontend y Principios de Diseño

### 2.1. Metodología Atomic Design

El código fuente alojado en `src/` fue estructurado bajo el patrón **Atomic
Design**, dividiendo la interfaz en niveles jerárquicos reutilizables:

| Nivel | Ubicación | Componentes |
|---|---|---|
| **Átomos** | `src/components/atoms/` | `Button.jsx`, `Image.jsx`, `Input.jsx`, `Text.jsx` |
| **Moléculas** | `src/components/molecules/` | `CardBody.jsx`, `CartItem.jsx`, `FormField.jsx`, `Texts.jsx` |
| **Organismos** | `src/components/organisms/` | `Navbar.jsx`, `Footer.jsx`, `ProductCard.jsx` (con modal interactivo de vista rápida) |
| **Plantillas** | `src/components/templates/` | `PageTemplate.jsx` (integra Navbar y Footer), `AdminLock.jsx` (protege la vista administrativa) |
| **Páginas** | `src/pages/` | Vistas completas conectadas al enrutador principal en `src/App.jsx` |

### 2.2. Principio de Responsabilidad Única (Single Responsibility)

Cada componente de React fue construido siguiendo el principio de **Single
Responsibility**: posee un propósito único y descriptivo, recibe datos y
funciones mediante propiedades (`props`), y gestiona su propio estado local
(`useState`) únicamente cuando es necesario para su interactividad.

---

## 3. Flujo de Navegación y Vistas Desarrolladas

### 3.1. Vistas Públicas de la Tienda

| # | Ruta | Vista |
|---|---|---|
| 1 | `/` | **Home.** Página principal con banner de bienvenida, accesos rápidos y productos destacados. |
| 2 | `/productos` | **Productos.** Catálogo completo con buscador interactivo en tiempo real por nombre o estilo. |
| 3 | `/productos/:id` | **Detalle de Producto.** Al presionar cualquier producto en el catálogo, este se agranda en una ventana modal mostrando su imagen, graduación alcohólica, descripción, precio y selector de cantidad, además de contar con su propia ruta dinámica. |
| 4 | `/categorias` | **Categorías.** Segmenta y filtra los productos dinámicamente según su categoría (Cervezas, Shooters, Aperitivos). |
| 5 | `/ofertas` | **Ofertas.** Vista exclusiva que filtra todos los productos con descuentos activos y precios rebajados para socios. |
| 6 | `/nosotros` | **Nosotros.** Vista informativa sobre la historia de la cervecería, despacho y compromiso de venta responsable (+18). |
| 7 | `/blog` · `/blog/:id` | **Blog.** Listado de artículos cerveceros con acceso al detalle individual de cada publicación (Detalle Blog #1 y Detalle Blog #2). |
| 8 | `/contacto` | **Contacto.** Formulario con validaciones de campos obligatorios, formato de correo institucional/personal y longitud mínima de mensaje. |
| 9 | `/login` · `/registro` | **Iniciar Sesión y Registro.** Formularios de autenticación y creación de cuenta con verificación obligatoria de mayoría de edad (+18 años). |
| 10 | `/carrito` | **Carrito de Compras.** Gestión en tiempo real de los productos agregados, permitiendo incrementar (+), disminuir (−), eliminar ítems individuales o limpiar el carrito completo. |
| 11 | `/checkout` | **Checkout / Paso de Pago.** Si el usuario ha iniciado sesión, sus datos personales y de dirección se autocompletan automáticamente. Si no, el sistema ofrece tres opciones: Iniciar sesión, Registrarse o Comprar como invitado. Solicita y valida datos del comprador, verificación de mayoría de edad (+18), tipo de entrega (domicilio o retiro), dirección, comuna y medio de pago, incluyendo un interruptor para simular pagos rechazados. |
| 12 | `/compra-exitosa` | **Pago Correcto.** Muestra el código único de la orden generada (`ORDER-...`), los datos de despacho y el desglose de productos pagados. |
| 13 | `/compra-fallida` | **Pago con Error.** Informa el rechazo de la transacción conservando intacto el carrito, muestra el resumen del intento y ofrece el botón "Volver a realizar el pago". |

### 3.2. Vista del Sistema Administrativo

| # | Ruta | Vista |
|---|---|---|
| 14 | `/admin` | **Panel de Administración / Dashboard.** Indicadores (KPIs): tarjetas superiores con el conteo en tiempo real de compras realizadas, productos en inventario y usuarios registrados. **Gestión CRUD de productos:** formulario controlado para crear nuevos productos, editar productos existentes (nombre, estilo, categoría, precio, porcentaje de descuento, ruta de imagen y descripción) y eliminarlos del inventario. **Órdenes / Boletas y Usuarios:** listado de las últimas boletas emitidas por el Checkout (con número de orden, cliente, monto total y estado) y listado de usuarios registrados con su rol. |

---

## 4. Especificación de Requisitos Funcionales (RF)

| Código | Nombre del Requerimiento | Descripción Funcional | Prioridad |
|---|---|---|---|
| **RF-01** | Migración a Componentes React | El sistema debe renderizar todas las vistas como componentes funcionales de React sin recargar el navegador mediante `react-router-dom`. | Alta |
| **RF-02** | Base de Datos Simulada y CRUD | El archivo `src/data/Products.js` debe actuar como fuente de datos simulada e implementar las operaciones de Crear, Leer, Actualizar y Eliminar productos, órdenes y usuarios. | Alta |
| **RF-03** | Persistencia en LocalStorage | Toda modificación en el carrito de compras, sesión activa, órdenes emitidas, usuarios e inventario de productos debe persistir en `localStorage` y reflejarse en tiempo real en la interfaz. | Alta |
| **RF-04** | Filtrado por Categorías, Ofertas y Búsqueda | El usuario debe poder filtrar productos por texto de búsqueda, por categoría y por estado de oferta. | Media |
| **RF-05** | Ampliación y Detalle de Producto | Al hacer clic sobre un producto, el sistema debe desplegar un modal ampliado con todos sus detalles y permitir navegar a `/productos/:id`. | Alta |
| **RF-06** | Verificación de Mayoría de Edad (+18) | El sistema debe calcular la edad exacta a partir de la fecha de nacimiento e impedir el registro o la compra a menores de 18 años. | Alta |
| **RF-07** | Gestión del Carrito de Compras | El usuario debe poder añadir productos, incrementar/disminuir unidades, quitar ítems, vaciar el carrito y visualizar el monto total actualizado en el Navbar y en la vista Carrito. | Alta |
| **RF-08** | Flujo de Checkout (Socio e Invitado) | El Checkout debe autocompletar los datos si existe sesión activa, o permitir elegir entre Iniciar sesión, Registrarse o Comprar como invitado si no hay sesión. | Alta |
| **RF-09** | Confirmación de Pago Exitoso y Fallido | Al procesar el Checkout, el sistema debe generar un número de orden (`ORDER-...`), registrarla en el historial y redirigir a Compra Exitosa o Compra Fallida según el resultado del pago. | Alta |
| **RF-10** | Panel Administrativo con Control de Rol | Solo los usuarios con rol `admin` (`admin@duoc.cl`) deben poder acceder al panel `/admin` para gestionar el inventario CRUD y visualizar las boletas y usuarios. | Alta |

---

## 5. Especificación de Requisitos No Funcionales (RNF)

| Código | Nombre del Requerimiento | Descripción |
|---|---|---|
| **RNF-01** | Diseño Responsivo | La interfaz debe adaptarse correctamente a dispositivos móviles, tabletas y pantallas de escritorio utilizando el sistema de grillas y componentes de Bootstrap 5 y React-Bootstrap. |
| **RNF-02** | Rendimiento de Renderizado | Los componentes de detalle y catálogo deben renderizarse en tiempos inferiores a 100 ms (verificado mediante las pruebas unitarias). |
| **RNF-03** | Calidad y Cobertura de Pruebas | Los componentes atómicos, organismos y páginas principales deben contar con pruebas unitarias automatizadas ejecutadas en Karma y Jasmine. |
| **RNF-04** | Validación de Correo | Los formularios deben validar el formato de correo electrónico admitiendo dominios `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`. |
| **RNF-05** | Despliegue y Control de Versiones | El código fuente debe mantenerse en un repositorio público de GitHub con configuración lista para despliegue continuo en Vercel (`vercel.json`). |

---

## 6. Verificación de Requisitos

| Criterio de aceptación | Estado |
|---|---|
| `npm run dev` levanta la aplicación sin errores y todas las vistas son navegables | ✅ |
| `npm run build` genera el build de producción sin errores | ✅ |
| `npm test` ejecuta la suite completa con **55/55 pruebas aprobadas** | ✅ |
| Los datos de carrito, sesión e inventario persisten tras recargar la página | ✅ |
| Los 13 componentes cuentan con pruebas unitarias (42 pruebas en total) | ✅ |