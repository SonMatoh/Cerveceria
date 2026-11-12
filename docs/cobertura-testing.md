# Documento de Cobertura y Análisis de Testing Unitario

| Campo | Valor |
|---|---|
| **Nombre del Proyecto** | La Taberna de Snorlax — Tienda Online en React |
| **Asignatura** | DSY1104 — Desarrollo Fullstack II |
| **Institución** | Duoc UC — Escuela de Informática y Telecomunicaciones |
| **Framework de Pruebas** | Jasmine + Karma + Webpack + React Testing Library |
| **Estado de la Suite** | **55 de 55 pruebas exitosas (TOTAL: 55 SUCCESS)** |
| **Fecha** | 18/10/2026 |
| **Integrantes** | Sergio Cerda · Mateo Hormaeche · Matias Contreras |

---

## 1. Propuesta y Objetivo del Testing

El objetivo del plan de pruebas unitarias es asegurar la funcionalidad,
estabilidad y calidad del código de los componentes React desarrollados para
"La Taberna de Snorlax".

Siguiendo el alcance propuesto para la Evaluación 2, se diseñó una batería
completa de **55 pruebas unitarias automatizadas** que abarcan todos los niveles
de la arquitectura Atomic Design (atoms, molecules, organisms, templates y
pages), verificando las cinco dimensiones exigidas en la pauta:

1. **Renderizado correcto** (listas, textos, imágenes, precios y plantillas).
2. **Renderizado condicional** (alertas de error, carrito vacío, bloqueo de administrador `AdminLock` y enlaces según rol).
3. **Manejo de propiedades (props)** (variantes de estilo, etiquetas dinámicas, atributos de imagen y campos de formulario).
4. **Gestión del estado (state)** (incremento/decremento de unidades, filtros, formularios controlados y pasarela de pago).
5. **Simulación de eventos de usuario** (clics en botones, eliminación de ítems, envíos de formulario y navegación de rutas).

---

## 2. Configuración del Entorno de Pruebas

| Archivo | Responsabilidad |
|---|---|
| **`karma.conf.cjs`** | Configura el servidor Karma con el framework Jasmine, empaqueta los archivos `.spec.jsx` con Webpack y Babel Loader, genera el reporte en `coverage/` y ejecuta las pruebas en ChromeHeadless / Edge. |
| **`babel.config.cjs`** | Define `@babel/preset-env` y `@babel/preset-react` para transpilar ES6+ y JSX. |
| **`src/test/setupTests.js`** | Registra los matchers de `@testing-library/jasmine-dom` antes de cada prueba y limpia el DOM con `cleanup()` en `afterEach`. |

Ejecución: `npm run test` (single run) o `npm run test:watch` (modo watch).

---

## 3. Matriz de Cobertura de Componentes (55 Pruebas Unitarias)

| Nivel | Archivo Spec Ejecutado | Componente Evaluado | Criterios Evaluados | Estado |
|---|---|---|---|---|
| Base | `example.spec.jsx` | Entorno Karma + Jasmine | Comprobación inicial de ejecución de la suite de pruebas. | SUCCESS |
| Átomos | `button.spec.jsx` | Button | Renderizado de children, aplicación de clases por props (`variant`) y simulación de clic con `jasmine.createSpy`. | SUCCESS |
| Átomos | `Text.spec.jsx` | Text | Renderizado de etiqueta `p` por defecto, cambio dinámico de tag (`h1`, `h2`, `span`) y clases CSS. | SUCCESS |
| Átomos | `Image.spec.jsx` | Image | Verificación de atributos `src`, `alt`, clases CSS y estilos pasados por props. | SUCCESS |
| Átomos | `Input.spec.jsx` | Input | Renderizado de campo de entrada, clase base `form-control`, placeholder y captura de escritura (`onChange`). | SUCCESS |
| Moléculas | `CardBody.spec.jsx` | CardBody | Renderizado de título, etiqueta de estilo, descripción, precio final y precio tachado condicional (`oldPrice`). | SUCCESS |
| Moléculas | `CartItem.spec.jsx` | CartItem | Renderizado del ítem en el carrito, cálculo de subtotal, botones `+`/`−` y evento de eliminación (`onRemove`). | SUCCESS |
| Moléculas | `FormField.spec.jsx` | FormField | Asociación correcta de `label` e `Input`, y visualización condicional del mensaje de error (`error`). | SUCCESS |
| Moléculas | `Texts.spec.jsx` | Texts | Renderizado agrupado de textos y subtítulos mediante propiedades. | SUCCESS |
| Organismos | `Navbar.spec.jsx` | Navbar | Enlaces de navegación, contador del carrito en tiempo real (`Cart (0)` a `Cart (2)`) y visibilidad condicional de "Administración". | SUCCESS |
| Organismos | `Footer.spec.jsx` | Footer | Renderizado del pie de página, información institucional y avisos legales de venta responsable. | SUCCESS |
| Organismos | `ProductCard.spec.jsx` | ProductCard | Renderizado de datos de producto, selector de cantidad, apertura de detalle/modal, adición al carrito y navegación con `useNavigate`. | SUCCESS |
| Templates | `PageTemplate.spec.jsx` | PageTemplate | Renderizado de la estructura general (Navbar, contenido hijo `children` en `main` y Footer). | SUCCESS |
| Templates | `AdminLock.spec.jsx` | AdminLock | Bloqueo condicional de acceso para usuarios sin sesión o con rol cliente, y acceso permitido para rol admin. | SUCCESS |
| Páginas | `Home.spec.jsx` | Home | Renderizado del banner principal, textos de bienvenida y estructura responsiva de Bootstrap. | SUCCESS |
| Páginas | `ProductDetail.spec.jsx` | ProductDetail | Manejo de ID inexistente ("Producto no encontrado"), carga de producto válido por `useParams` y test de rendimiento (menos de 100 ms). | SUCCESS |
| Páginas | `Carrito.spec.jsx` | Carrito | Estado condicional de carrito vacío, listado de productos con cálculo de total y eliminación de ítems. | SUCCESS |
| Páginas | `Contacto.spec.jsx` | Contacto | Validación de errores con formulario vacío y envío exitoso al ingresar datos válidos. | SUCCESS |
| Páginas | `Checkout.spec.jsx` | Checkout | Opciones sin sesión (Iniciar sesión, Registrarse, Invitado), validación de mayoría de edad (+18) y confirmación de compra. | SUCCESS |
| **TOTAL** | **Suite Completa** | **Todos los niveles** | **55 de 55 pruebas unitarias superadas en 0.262 segundos** | **55 SUCCESS** |

---

## 4. Cobertura por Nivel de Atomic Design

| Nivel | Componentes | Con prueba | Pruebas |
|---|---|---|---|
| Átomos | 4 | 4 | 12 |
| Moléculas | 4 | 4 | 12 |
| Organismos | 3 | 3 | 12 |
| Templates | 2 | 2 | 6 |
| **Total componentes** | **13** | **13** | **42** |
| Páginas | 16 | 5 | 12 |
| Suite base | — | 1 | 1 |
| **TOTAL suite** | — | — | **55** |

---

## 5. Técnicas de Aislamiento

Para asegurar que las pruebas sean deterministas se aplican las siguientes
técnicas:

| Técnica | Aplicación |
|---|---|
| **`MemoryRouter` / `createMemoryRouter`** | Permite verificar navegaciones y redirecciones de `Navbar`, `ProductCard`, `PageTemplate` y `AdminLock` sin modificar la URL real. |
| **`beforeEach` con `vaciarCarrito()` y `cerrarSesion()`** | Limpia el `localStorage` entre pruebas para que el estado de una no contamine la siguiente. |
| **`jasmine.createSpy()`** | Verifica que un callback fue invocado con ciertos argumentos, sin ejecutar la lógica real. |

---

## 6. Evidencia de Ejecución en Consola

Comando ejecutado:

```bash
npm run test
```

Salida:

```
Edge 155.0.0.0 (Windows 10): Executed 55 of 55 SUCCESS (0.262 secs / 0.237 secs)
TOTAL: 55 SUCCESS
```

| Métrica | Valor |
|---|---|
| Pruebas ejecutadas | 55 |
| Pruebas aprobadas | 55 |
| Pruebas fallidas | 0 |
| Tasa de éxito | 100 % |
| Navegador | Microsoft Edge 155.0.0.0 (headless, Windows 10) |
| Tiempo total | 0.262 s |

---

## 7. Criterios de Cobertura Alcanzados

| Dimensión evaluada | Cubierta por |
|---|---|
| Renderizado correcto | 22 pruebas de renderizado en átomos, moléculas, organismos y páginas |
| Renderizado condicional | 13 pruebas (hint/error, badges, precio tachado, sesión, rol admin) |
| Manejo de props | 10 pruebas (variants, className, styles, htmlFor, ref) |
| Gestión del estado | 6 pruebas (cantidad de carrito, sesión, formularios controlados) |
| Simulación de eventos | 4 pruebas (onClick, agregar/quitar del carrito, envío de formularios) |
| Lógica de negocio | Redirecciones de `AdminLock`, mayoría de edad en Checkout |

---

## 8. Pendientes (Mejoras Sugeridas)

- Pruebas unitarias de las páginas restantes: `Registro`, `Productos`, `Ofertas`, `Nosotros`, `Login`, `CompraFallida`, `CompraExitosa`, `Categorias` y `Admin`.
- Simulación de fallos de persistencia en `localStorage`.
- Medición de cobertura de código instrumentada (Istanbul / nyc).
- Reemplazar el global `window.actualizarNavbar` por un contexto de React, lo que permitiría testear `ProductCard` de forma aislada.