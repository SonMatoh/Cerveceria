# Documento de Cobertura de Testing (V2)

**Proyecto:** La Taberna de Snorlax — Tienda online
**Asignatura:** DSY1104 — Desarrollo Fullstack II
**Etapa:** Evaluación Parcial 2 — proceso de testeo unitario del frontend
**Fecha:** ___/___/2026
**Equipo:** *(completar con nombres de los integrantes)*

---

## 1. Objetivo

Validar que los componentes del frontend funcionen como se espera: renderizado
correcto, comportamiento condicional, recepción de props, gestión de estado,
respuesta a eventos y corrección de la lógica de negocio (CRUD y validaciones),
antes de la entrega del proyecto.

## 2. Herramientas configuradas

| Herramienta | Uso |
|---|---|
| **Jasmine** | Framework de pruebas (describe / it / expect) |
| **Karma** | Ejecutor de pruebas en navegador headless |
| **@testing-library/react** | Renderizado y consulta de componentes React |
| **Webpack + Babel (babel-loader)** | Empaqueta los specs JSX para el navegador |
| **Edge/Chrome headless** | Navegador en el que corren las pruebas |

Configuración: `karma.conf.cjs` · Specs: carpeta `tests/` ·
Ejecución: `npm test` (single run) o `npm run test:watch`.

## 3. Alcance del testing

Cobertura según las categorías del Anexo 1:

1. **Pruebas de renderizado** — que los componentes se rendericen con los datos proporcionados.
2. **Renderizado condicional** — que los elementos se muestren/oculten según condiciones.
3. **Pruebas de props** — que los componentes reciban y utilicen correctamente sus propiedades.
4. **Pruebas de estado** — que los cambios de estado se reflejen en la interfaz.
5. **Pruebas de eventos** — simular clics/escritura y verificar reacciones (cambios de estado o funciones ejecutadas).
6. **Lógica de negocio** — CRUD del inventario y validaciones de formularios.

## 4. Casos de prueba (21 pruebas — 6 archivos)

| # | Archivo | Prueba | Categoría |
|---|---|---|---|
| 1 | `validaciones.spec.jsx` | Acepta correos de dominios permitidos (duoc.cl, profesor.duoc.cl, gmail.com) | Lógica |
| 2 | `validaciones.spec.jsx` | Rechaza dominios no permitidos o formato inválido | Lógica |
| 3 | `validaciones.spec.jsx` | Contraseña entre 4 y 10 caracteres | Lógica |
| 4 | `validaciones.spec.jsx` | Detección de contraseñas que no coinciden | Lógica |
| 5 | `validaciones.spec.jsx` | Nombres y mensajes con largo mínimo | Lógica |
| 6 | `inventarioStore.spec.jsx` | Lectura del inventario semilla | Lógica/CRUD |
| 7 | `inventarioStore.spec.jsx` | **CREAR** producto y leerlo por id | Lógica/CRUD |
| 8 | `inventarioStore.spec.jsx` | **ACTUALIZAR** precio y descuento | Lógica/CRUD |
| 9 | `inventarioStore.spec.jsx` | **ELIMINAR** producto del inventario | Lógica/CRUD |
| 10 | `ProductoCard.spec.jsx` | Muestra nombre, estilo y precio recibidos por **props** | Renderizado + props |
| 11 | `ProductoCard.spec.jsx` | Insignia de oferta solo se muestra si `descuento > 0` (y aplica precio con dto) | Renderizado condicional |
| 12 | `ProductoCard.spec.jsx` | Botones +/− cambian la **cantidad (estado)** y "Agregar" lleva al carrito | Estado + eventos |
| 13 | `Carrito.spec.jsx` | Mensaje de carrito vacío cuando no hay ítems | Renderizado condicional |
| 14 | `Carrito.spec.jsx` | Lista ítems y calcula el total ($2.000) | Renderizado |
| 15 | `Carrito.spec.jsx` | Botón "Quitar" elimina el ítem del carrito | Eventos |
| 16 | `Navbar.spec.jsx` | Contador del carrito se actualiza en tiempo real (0 → 2 → 3) | Estado + eventos |
| 17 | `Navbar.spec.jsx` | Muestra login sin sesión; usuario + cerrar con sesión; logout vuelve al estado inicial | Renderizado condicional |
| 18 | `Checkout.spec.jsx` | Autocompletado del formulario desde la **sesión persistida** | Props/persistencia |
| 19 | `Checkout.spec.jsx` | Escribir en los campos actualiza el estado del formulario | Estado |
| 20 | `Checkout.spec.jsx` | Envío incompleto muestra errores de validación y **no navega** | Renderizado condicional + eventos |
| 21 | `Checkout.spec.jsx` | Pago válido navega al resumen de compra exitosa, vacía el carrito y guarda el resumen | Eventos + integración |

## 5. Resultados de la última ejecución

```
Edge 154.0.0.0 (Windows 10): Executed 21 of 21 SUCCESS
TOTAL: 21 SUCCESS
```

- **Pruebas aprobadas:** 21 / 21 (100 %)
- **Requeridas por la rúbrica (IE2.2.1):** 10 → *se entregan 21 (nivel "muy buen desempeño" = 10/10)*

## 6. Mapa con los indicadores de evaluación

| Indicador | Qué lo respalda |
|---|---|
| **IE2.2.1** — Pruebas unitarias con Jasmine y Karma (12 %) | 21 pruebas en `tests/`, ejecutadas con `npm test` |
| **IE2.3.1** — Proceso de testeo: entorno, escritura, mocks, análisis y cobertura (8 %) | `karma.conf.cjs` (entorno), specs (escritura), stores con estado aislado y `beforeEach` (preparación/aislamiento), análisis de resultados en este documento |

## 7. Cobertura y pendientes

**Cubierto:**
- Componentes `ProductoCard`, `Navbar`, vista `Carrito`, vista `Checkout`.
- Lógica pura: `validaciones.js` e `inventarioStore.js` (CRUD).

**Pendiente (mejora sugerida):**
- Vista `Admin` (abrir/confirmar edición) y `Registro` (requiere `window.confirm` simulado).
- Mocks de `localStorage` para simular fallos de persistencia.
- Cobertura de código medida con instrumentación (Istanbul/nyc).

## 8. Cómo ejecutar las pruebas

```bash
npm install
npm test          # ejecución única (single run)
npm run test:watch  # modo watch (re-ejecuta al guardar cambios)
```
