# Contexto MVP

## Vision actual

La app ya existe como prototipo funcional de alta fidelidad en web. La prioridad ha sido recorrer el flujo emocional del producto antes que cerrar integraciones complejas.

La experiencia intenta parecer una app lifestyle/wellness:
- tarjetas redondeadas
- mucho blanco y tonos rosados suaves
- composicion claramente mobile-first
- foco en planes, recuerdos y continuidad de pareja

## Lo que esta implementado

### Navegacion

La navegacion principal vive en [src/app/router.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/app/router.tsx).

Hay dos bloques:
- flujo de onboarding
- app principal dentro de `AppShell` con bottom navigation

### Estado global

El estado vive en [src/store/useAppStore.ts](/Users/david/Developer/proyectos-personales/planes-pareja/src/store/useAppStore.ts).

Persiste en `localStorage`:
- onboarding completado
- preferencias de la pareja
- planes desbloqueados
- recuerdos
- recordatorios

Incluye un recuerdo semilla para que la home y el album no arranquen vacios.

### Datos

Los 30 planes iniciales viven en [src/data/plans.ts](/Users/david/Developer/proyectos-personales/planes-pareja/src/data/plans.ts).

Decisiones relevantes:
- el MVP debe mantener 30 planes
- los planes son tipados
- las imagenes usan URLs remotas
- hay una distincion simple entre planes desbloqueados y premium

Los lugares cercanos mock viven en [src/data/nearbyPlaces.ts](/Users/david/Developer/proyectos-personales/planes-pareja/src/data/nearbyPlaces.ts).

### Pantallas

Onboarding:
- [src/features/onboarding/OnboardingPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/onboarding/OnboardingPage.tsx)
- [src/features/onboarding/PreferencesPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/onboarding/PreferencesPage.tsx)
- [src/features/onboarding/ReadyPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/onboarding/ReadyPage.tsx)

Home:
- [src/features/home/HomePage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/home/HomePage.tsx)

Planes:
- [src/features/plans/PlansPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/plans/PlansPage.tsx)
- [src/features/plans/PlanDetailPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/plans/PlanDetailPage.tsx)
- [src/features/plans/CompletePlanPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/plans/CompletePlanPage.tsx)

Nearby:
- [src/features/nearby/NearbyPlacesPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/nearby/NearbyPlacesPage.tsx)

Recuerdos:
- [src/features/memories/MemoriesPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/memories/MemoriesPage.tsx)
- [src/features/memories/MemoryDetailPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/memories/MemoryDetailPage.tsx)

Recordatorios:
- [src/features/reminders/RemindersPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/reminders/RemindersPage.tsx)

Album:
- [src/features/album/AlbumPage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/album/AlbumPage.tsx)

Perfil:
- [src/features/profile/ProfilePage.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/features/profile/ProfilePage.tsx)

## Componentes base

UI reusable:
- [src/components/ui/Button.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/Button.tsx)
- [src/components/ui/Card.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/Card.tsx)
- [src/components/ui/Chip.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/Chip.tsx)
- [src/components/ui/ProgressBar.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/ProgressBar.tsx)
- [src/components/ui/StarRating.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/StarRating.tsx)
- [src/components/ui/PageHeader.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/ui/PageHeader.tsx)

Cards de dominio:
- [src/components/plans/PlanCard.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/plans/PlanCard.tsx)
- [src/components/plans/MemoryCard.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/plans/MemoryCard.tsx)

Layout:
- [src/components/layout/AppShell.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/layout/AppShell.tsx)
- [src/components/layout/MobileFrame.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/layout/MobileFrame.tsx)
- [src/components/layout/BottomNav.tsx](/Users/david/Developer/proyectos-personales/planes-pareja/src/components/layout/BottomNav.tsx)

## Estilo y criterios visuales

La base visual esta en [src/styles/globals.css](/Users/david/Developer/proyectos-personales/planes-pareja/src/styles/globals.css) y [tailwind.config.ts](/Users/david/Developer/proyectos-personales/planes-pareja/tailwind.config.ts).

Principios que conviene mantener:
- interfaz suave y limpia
- nada de aspecto enterprise o dashboard frio
- heroes fotograficos calidos
- botones principales redondos y muy claros
- densidad baja, respiracion alta

## Decisiones tecnicas importantes

### Ahorro de tokens y modelos

El proyecto tiene una politica explicita de enrutado de modelos en [docs/model-routing.md](/Users/david/Developer/proyectos-personales/planes-pareja/docs/model-routing.md).

Resumen:
- usar modelos potentes solo para orquestacion y decisiones dificiles
- usar modelos mas baratos para implementacion y subagentes
- no usar el modelo mas caro para cambios rutinarios de codigo
- avisar al usuario si la herramienta no permite controlar el modelo o si una tarea justifica saltarse la regla

### Persistencia local primero

Se ha priorizado `zustand/persist` para mover rapido el MVP sin introducir backend ni auth.

Consecuencia:
- la app funciona bien como demo local
- no hay sincronizacion entre dispositivos

La arquitectura acordada para sustituir esta persistencia local esta documentada en
[backend-data-sync.md](./backend-data-sync.md). Define el modelo backend, SQLite,
Filesystem y el relay temporal de fotografias entre los dos moviles.

### Integraciones externas desacopladas

De momento hay placeholders o mocks para:
- nearby places
- compartir
- album/PDF
- notificaciones

Eso permite evolucionar a servicios reales sin desmontar la UI.

### Configuracion de red local

En [package.json](/Users/david/Developer/proyectos-personales/planes-pareja/package.json), `npm run dev` ya usa `vite --host` para exponer la app en la LAN.

## Limitaciones conocidas

- Hay archivos generados por compilacion en la raiz como `vite.config.js`, `tailwind.config.js`, `capacitor.config.js` y `*.d.ts`.
- El build funciona, pero Vite avisa de un chunk grande.
- `PublicWrapper` esta declarado en el router y ahora mismo no se usa.
- No existe estructura `services/` aun, aunque la especificacion la propone para la siguiente fase.
- Las imagenes remotas dependen de terceros; si se quiere robustez offline o para stores, convendra pasar a assets propios o CDN controlada.

## Recomendaciones para la siguiente IA

### Si el objetivo es producto

Atacar primero:
1. premium/desbloqueo
2. mejorar personalizacion del plan recomendado
3. vacios y estados edge case

### Si el objetivo es mobile real

Atacar primero:
1. instalar plugins de Capacitor
2. abstraer camera/share/notifications/location en hooks o services
3. separar comportamiento web de comportamiento nativo

### Si el objetivo es backend

Atacar primero:
1. definir esquema persistente de `CompletedPlan`, preferencias y fotos
2. crear `services/storageService.ts`
3. mover seeded data a estrategia controlada

### Si el objetivo es performance

Atacar primero:
1. code splitting por rutas
2. revisar dependencias pesadas
3. mover imagenes a una estrategia mas estable

## Checklist rapido antes de tocar nada grande

- Leer la especificacion fuente.
- Revisar el store para entender el estado persistido.
- Revisar el router para no romper el flujo principal.
- Confirmar si el cambio afecta a modo web, PWA o futuro nativo.
- Mantener el tono emocional del producto en textos y UI.
