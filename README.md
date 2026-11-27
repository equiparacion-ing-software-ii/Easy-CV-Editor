# Live Editor CV

## Descripción General

Live Editor CV es un sistema de creación y gestión de currículums interactivo, construido sobre React y Vite. A diferencia de las plantillas estáticas tradicionales, esta aplicación ofrece una experiencia de edición visual directa (WYSIWYG) basada en bloques. 

La arquitectura permite manipular el orden de las secciones y el contenido de forma intuitiva, garantizando que el diseño en pantalla coincida 1:1 con la generación del documento final (PDF) a través de un servicio de renderizado backend automatizado.

## Características Principales

*   **Edición en Línea (Inline Editing):** Toda la información de la interfaz gráfica es editable al hacer clic, eliminando la necesidad de formularios separados.
*   **Gestión de Bloques (Drag and Drop):** Integración profunda con `@dnd-kit` para reordenamiento de secciones enteras y elementos individuales.
*   **Persistencia Local y Portabilidad:** El estado de la aplicación se gestiona a través de un esquema JSON estricto almacenado en el `localStorage` del navegador. Permite la exportación e importación del estado en formato JSON.
*   **Generación de PDF Pixel-Perfect:** Utiliza Netlify Functions y Puppeteer (`@sparticuz/chromium`) para interceptar el estado actual del cliente e inyectarlo en una instancia *headless* del navegador, asegurando que la impresión refleje con precisión las modificaciones del usuario, incluyendo preferencias de modo oscuro.

## Requisitos del Sistema

*   Node.js v22 o superior y npm.

## Cómo Correrlo en Local para Desarrollo

### Opción A: Con Docker (Recomendado)
 
1. Crear `.env` a partir de la plantilla de variables de entorno:
   ```bashe.env.example
   cp .env.example .env
   ```
2. Construir la imagen y levantar el servidor de desarrollo Vite (`http://localhost:5173`):
   ```bash por defecto en 
   docker compose up -d --build
   ```
3. Ver
| T| :--- | :--- |
Cheasheet de c
Linter (ESLint) | `docker compose exec app npm run lint` |
| Tests unitarios (Vitest) | `docker compose exec app npm test` |
| Tests en modo watch | `docker compose exec app npm run test:watch` |
| Tests E2E en Chrome (Cypress) | `docker compose run --rm cypress` |
| Un spec E2E puntual | `docker compose run --rm cypress --browser chrome --spec cypress/e2e/<archivo>.cy.js` |
> [!NOTE]
> Antes de ejecutar pruebas E2E por primera vez, construir la imagen de Cypress con `docker compose --profile test build cypress`.

#### Actualización de dependencias (`package.json` / `package-lock.json`)
El contenedor aísla `/app/node_modules` en un volumen anónimo para evitar conflictos entre el sistema host y Linux.1. Copiar `.env
.example` a `.env` e instalar dependencias respetando `package-lock.json`:

   cp .env.example .env
   npm ci
   ```
2. Iniciar el servidor de desarrollo (`http://localhost:5173`):
   ```bash
   npm run dev
   ```

## Cómo Crear la Build

La aplicación se compila como una SPA estática dentro de la carpeta `dist/`.

> [!IMPORTANT]
> Vite incrusta las variables `VITE_*` (como los feature flags de `.env.example` o credenciales públicas de Supabase) **en tiempo de compilación**. Asegurarse de definirlas antes de ejecutar el build.

### Build local y verificación

* **Con Docker** (compila una imagen actualizada y valida lint, tests unitarios y build en un contenedor limpio):
  ```bash
  docker compose build app
  docker compose run --rm --no-deps app sh -c "npm run lint && npm test && npm run build"
  ```
* **Con Node.js local:**
  ```bash
  npm run build
  npm run preview
  ```

### Build y despliegue automatizado (CI/CD + Netlify)

El flujo definido en `.github/workflows/ci-cd.yml` ejecuta `npm run lint` y `npm test` en paralelo, compila `dist/` una única vez con `npm run build` y publica ese artefacto verificado en Netlify mediante `netlify-cli` (`deploy_preview` en Pull Requests hacia `main` y `deploy_production` al integrar en `main`, utilizando la configuración de `netlify.toml`).

## Documentación

El repositorio contiene documentación técnica y operativa detallada en el directorio `/docs`:

*   [Documentación Técnica](docs/TECHNICAL_DOCUMENTATION.md)
*   [Manual de Desarrollo](docs/DEVELOPMENT_MANUAL.md)
*   [Manual de Usuario](docs/USER_MANUAL.md)
*   [Backlog y Roadmap](docs/BACKLOG.md)

## Licencia

Este proyecto está bajo la Licencia MIT.
