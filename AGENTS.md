# AGENTS.md

Guia rapida para cualquier IA o persona que retome este proyecto.

## Resumen

Proyecto: Vive2, app mobile-first para planes en pareja.

Objetivo actual:
- Tener un MVP visual y navegable en web/PWA.
- Mantener la base preparada para evolucionar a Capacitor.

Estado actual:
- Flujo principal implementado.
- Datos locales y persistencia local con Zustand.
- Sin backend real todavia.
- Sin integraciones reales de mapas, notificaciones nativas ni exportacion PDF.

Documento de producto fuente:
- [especificaciones-app-planes-pareja.md](./docs/especificaciones-app-planes-pareja.md)

Contexto operativo ampliado:
- [docs/contexto-mvp.md](./docs/contexto-mvp.md)

Reset de producto y flujo recomendado:
- [docs/product-reset.md](./docs/product-reset.md)

Politica de modelos y ahorro de tokens:
- [docs/model-routing.md](./docs/model-routing.md)

## Politica de modelos

Prioridad del proyecto:
- Ahorrar tokens y coste siempre que no comprometa la calidad.
- Usar el modelo mas potente disponible solo para orquestacion, arquitectura, decisiones con alta incertidumbre, revisiones complejas y descomposicion de tareas.
- No usar el modelo mas caro para implementacion rutinaria.
- Para implementar cambios ya definidos, ediciones mecanicas, pruebas, lectura de archivos y subagentes, preferir modelos mas baratos.

Enrutado deseado si la plataforma permite escoger modelos:
- Orquestacion y decisiones: GPT 5.5 o el modelo mas capaz disponible.
- Implementacion: GPT 5.4 o GPT 5.4 mini.
- Subagentes: GPT 5.4 mini por defecto; subir a GPT 5.4 solo si la tarea requiere mas contexto o precision.

Si la plataforma no expone control real de modelo desde el repo, tratar estas reglas como instruccion operativa para la IA actual y futuras IAs. Avisar al usuario si una tarea necesita saltarse esta politica por riesgo tecnico, incertidumbre alta o falta de soporte de la herramienta.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form + Zod
- Tailwind CSS
- Framer Motion
- Config base de Capacitor

## Comandos

- Usar una version reciente y estable de Node compatible con el stack del proyecto.
- Instalar dependencias: `npm install`
- Desarrollo en red local: `npm run dev`
- Build de produccion: `npm run build`
- Preview local: `npm run preview`
- Tests: `npm test`

Nota:
- El script `dev` ya incluye `--host`, asi que Vite expone URL LAN para abrir desde otros dispositivos de la misma red.

## Donde mirar primero

- Rutas: [src/app/router.tsx](./src/app/router.tsx)
- Estado global: [src/store/useAppStore.ts](./src/store/useAppStore.ts)
- Catalogo de planes: [src/data/plans.ts](./src/data/plans.ts)
- Lugares mock: [src/data/nearbyPlaces.ts](./src/data/nearbyPlaces.ts)
- Estilos globales: [src/styles/globals.css](./src/styles/globals.css)
- Shell mobile y bottom nav:
  [src/components/layout/AppShell.tsx](./src/components/layout/AppShell.tsx)
  [src/components/layout/MobileFrame.tsx](./src/components/layout/MobileFrame.tsx)
  [src/components/layout/BottomNav.tsx](./src/components/layout/BottomNav.tsx)

## Flujo implementado

- `/onboarding`
- `/onboarding/preferences`
- `/onboarding/ready`
- `/home`
- `/plans`
- `/plans/:planId`
- `/plans/:planId/nearby`
- `/plans/:planId/complete`
- `/memories`
- `/memories/:memoryId`
- `/reminders`
- `/album`
- `/profile`

## Reglas practicas para futuras iteraciones

- Mantener la experiencia mobile-first.
- Preservar el tono emocional y calido del producto.
- Si se anaden planes, revisar que el MVP siga mostrando exactamente 30 si esa sigue siendo la meta.
- Si se conecta backend, intentar no romper el modo local actual.
- Si se anaden integraciones nativas, dejarlas desacopladas en `services/` o `hooks/`.
- Siempre que se toque codigo, ejecutar tests antes de cerrar el trabajo.
- Si los tests fallan despues de un cambio, arreglarlos antes de terminar.

## Limitaciones actuales

- Los lugares cercanos son mock y no salen de una API real.
- El album es una pantalla MVP con CTA, no genera PDF todavia.
- Compartir usa Web Share o clipboard como fallback web.
- Recordatorios se guardan en estado local, pero no disparan notificaciones nativas reales aun.
- Hay warning de chunk grande en build; no bloquea el MVP.

## Siguiente mejor paso recomendado

Elegir uno de estos frentes antes de abrir demasiados a la vez:

1. Integrar Places reales para `/plans/:planId/nearby`.
2. Preparar Capacitor real con plugins y builds iOS/Android.
3. Añadir capa de servicios y persistencia backend para recuerdos y fotos.
4. Implementar exportacion PDF del album.
