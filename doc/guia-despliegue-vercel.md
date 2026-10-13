# Guía de despliegue — Cervecería React en Vercel

Documento de referencia con los pasos realizados para conectar este proyecto a GitHub y publicarlo en Vercel usando la rama `Avance-React`.

- **Repositorio:** https://github.com/SonMatoh/Cerveceria
- **Rama de desarrollo/despliegue:** `Avance-React`
- **Rama antigua (NO tocar):** `main` (contiene la versión estática HTML/JS)
- **Sitio en producción:** https://cerveceria-kappa.vercel.app

---

## 1. Estado actual del repositorio

| Elemento | Valor |
|---|---|
| Remoto | `origin` → `https://github.com/SonMatoh/Cerveceria.git` |
| Rama activa | `Avance-React` |
| Último deploy | `fa71895` — Ready — **Production** |

---

## 2. Preparación local (una sola vez)

### 2.1 Conectar el remoto

```bash
git remote add origin https://github.com/SonMatoh/Cerveceria.git
git remote -v
git fetch origin
```

### 2.2 Archivo `.gitignore`

Se creó `.gitignore` para no subir carpetas generadas ni dependencias:

```
node_modules/
dist/
coverage/
.env
.vscode/
```

### 2.3 Archivo `vercel.json` (obligatorio para esta app)

Como el proyecto usa `BrowserRouter` (`src/main.jsx`), sin este archivo las rutas
internas como `/carrito` o `/admin` devuelven **404** al recargar en Vercel:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 3. Flujo de trabajo con Git (uso diario)

Rama de trabajo = `Avance-React`. `main` no se modifica.

```bash
# Ver rama actual
git branch --show-current

# Guardar cambios y subir
git add .
git commit -m "descripcion del cambio"
git push origin Avance-React
```

Cada `push` a `Avance-React` dispara automáticamente un **Production Deployment** en Vercel.

### Ramas útiles

```bash
git branch -a                      # ramas locales y remotas
git status                         # estado del árbol de trabajo
git log --oneline -10              # últimos commits
git fetch origin                   # actualizar referencias remotas
```

---

## 4. Despliegue en Vercel (configuración inicial)

1. Ir a https://vercel.com/new/import y conectar el repositorio `SonMatoh/Cerveceria`.
2. En el formulario de importación:
   - **Project Name:** solo minúsculas (Vercel lo exige), p. ej. `cerveceria`.
   - **Root Directory:** `./`
   - **Application Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Click en **Deploy**.

> El primer deploy usa la rama `main` (versión estática HTML) y **falla** con
> `vite: command not found`. Es esperado y no afecta nada: solo lee `main`, no lo modifica.

---

## 5. Configurar la Production Branch

Vercel no permite fijar la rama de producción desde *Settings → Git*. La opción está en
**Settings → Environments → Production → Branch Tracking**.

1. **Settings → Environments**
2. Click en **Production**
3. En **Branch Tracking** escribir `Avance-React`
4. **Save**

> Vercel muestra el error *"No deployments found for 'Avance-React'. Deploy the branch, then retry"*
> y el botón **Save** queda deshabilitado mientras la rama no tenga al menos un deployment.

### Cómo desbloquearlo

1. Crear un commit vacío y subirlo (esto genera el primer deployment de la rama):

```bash
git commit --allow-empty -m "chore: deploy inicial en Vercel"
git push origin Avance-React
```

2. Volver a **Settings → Environments → Production**, escribir `Avance-React` y **Save**.
3. Con la Production Branch ya configurada, el siguiente push crea el deployment de producción.

---

## 6. Verificación

### En Vercel
**Deployments** debe mostrar:

| Deployment | Estado | Entorno | Rama |
|---|---|---|---|
| `chore: deploy inicial en Vercel` | Ready | Production | `Avance-React` |

### En el sitio
Rutas que deben responder 200 y renderizar:

- `/` — home
- `/productos` — catálogo con imágenes
- `/categorias`, `/ofertas`
- `/carrito`
- `/admin` — redirige a `/login` si no hay sesión de administrador
- `/login`, `/registro`, `/contacto`

### Local (opcional)
```bash
npm test          # 57 pruebas con Karma/Jasmine
npm run build     # build de producción con Vite
```

---

## 7. Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `vite: command not found` | Se intentó construir `main` (no tiene `package.json`) | Configurar Production Branch = `Avance-React` y volver a desplegar |
| `No deployments found for 'Avance-React'` | La rama aún no tiene deployments | Hacer push de la rama, luego guardar el Branch Tracking |
| El nombre del proyecto se marca en rojo | Vercel exige minúsculas | Escribir el nombre en minúsculas |
| 404 al recargar `/carrito`, `/admin` | Falta el rewrite SPA | Verificar que exista `vercel.json` con `rewrites` |
| Imágenes no cargan en producción | Rutas con distinta capitalización | Vercel usa Linux (case-sensitive): `Char.png` ≠ `char.png` |

---

## 8. Preguntas frecuentes sobre Vercel

**¿Vercel me bloquea si reescribo todo el código?**
No. Vercel no bloquea cambios grandes ni reescrituras completas. Cada `push` ejecuta un
build desde cero y reemplaza la versión publicada. Los deployments anteriores se conservan
para poder hacer rollback.

**¿Puedo dejar de usar Vercel?**
Sí. Vercel es solo hosting; el código vive en tu repositorio de GitHub. Puedes migrar a
otro proveedor en cualquier momento.

**¿Qué pasa con `main`?**
No se modifica. `main` contiene la versión estática original y sirve de respaldo.