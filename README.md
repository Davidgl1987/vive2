# Vive2

Vive2 es una aplicación mobile-first para descubrir, planificar, vivir y guardar planes en pareja. El objetivo es convertir ideas sueltas en experiencias con fecha, recuerdos compartidos y retos que puedan terminar en un álbum o libro impreso.

## Demo

La versión web se publica automáticamente en:

**https://davidgl1987.github.io/vive2/**

## Funcionalidades actuales

- Onboarding visual y configuración inicial de la pareja.
- Catálogo localizado de planes con búsqueda y filtros.
- Propuestas, aceptación y calendario compartido en Agenda.
- Retos configurables de 10, 20 o 30 planes.
- Recuerdos organizados por reto, con una foto por miembro.
- Álbum independiente para cada reto.
- Perfil, invitación de pareja y configuración de avisos.
- Persistencia local con Zustand.
- Diseño responsive preparado para web, PWA y Capacitor.

## Stack

- React 19 y TypeScript
- Vite
- React Router
- Zustand
- React Hook Form y Zod
- Tailwind CSS
- Framer Motion
- Vitest y Testing Library
- Capacitor

## Desarrollo local

Requiere Node.js 22 o superior. El proyecto se desarrolla actualmente con Node.js 24.

```bash
npm install
npm run dev
```

Vite sirve la aplicación en `http://localhost:4173` y la expone también en la red local.

## Comandos

```bash
npm test          # Ejecuta la suite de tests
npm run build     # Genera el build de producción estándar
npm run build:pages # Genera el build bajo /vive2/ para GitHub Pages
npm run preview   # Previsualiza el build local
```

## GitHub Pages

El workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) ejecuta tests, genera el build y publica `dist` con GitHub Actions en cada push a `main`.

El build utiliza `/vive2/` como ruta base. También genera un `404.html` compatible con React Router para poder abrir o recargar rutas internas directamente.

## Estado del proyecto

Vive2 es actualmente un MVP visual y navegable. Los datos de usuario permanecen en el dispositivo y todavía no hay autenticación, sincronización entre miembros, notificaciones nativas ni almacenamiento temporal de fotografías.

La arquitectura prevista contempla una app nativa con Capacitor, backend para autenticación y coordinación, y fotografías cifradas almacenadas temporalmente hasta quedar verificadas en los dispositivos de ambos miembros.

Consulta [`docs/contexto-mvp.md`](docs/contexto-mvp.md) y [`docs/product-reset.md`](docs/product-reset.md) para ampliar el contexto funcional y las decisiones del producto.
