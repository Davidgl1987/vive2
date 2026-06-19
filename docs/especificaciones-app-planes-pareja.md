# Especificación de producto — App de planes en pareja

## 1. Visión general

La app será una aplicación móvil creada con tecnologías web y empaquetada con Capacitor para publicarse en App Store y Google Play.

La propuesta principal es:

> Una app para que las parejas descubran, planifiquen, vivan y guarden 30 planes especiales, convirtiendo cada experiencia en un recuerdo con foto, fecha, texto, valoración y opción de crear un álbum/libro imprimible.

No debe plantearse solo como una lista de ideas de citas, sino como una experiencia guiada de pareja: inspiración + acción local + recuerdo emocional + álbum final.

---

## 2. Referencia visual del flujo de pantallas

La siguiente imagen sirve como referencia de estilo, estructura visual y flujo principal de pantallas.

![Flujo de pantallas de la app](./flujo-pantallas-app-pareja.png)

### Pantallas representadas

1. Onboarding inicial.
2. Cuestionario de personalización.
3. Confirmación de planes preparados.
4. Home/dashboard.
5. Listado de planes.
6. Detalle del plan.
7. Formulario de plan completado.
8. Recuerdo guardado.
9. Configuración de recordatorios.
10. Lugares cercanos.
11. Álbum/libro imprimible.
12. Notificación push mensual.

---

## 3. Objetivos del producto

### Objetivo principal

Ayudar a una pareja a realizar al menos un plan significativo al mes y conservar esos momentos como recuerdos visuales y escritos.

### Objetivos secundarios

- Inspirar planes originales o con un giro especial.
- Reducir la fricción de decidir qué hacer.
- Ayudar a encontrar sitios cercanos relacionados con cada plan.
- Incentivar la constancia mediante recordatorios configurables.
- Permitir compartir recuerdos en redes sociales.
- Monetizar mediante versión premium, afiliación y álbum/libro imprimible.

---

## 4. Público objetivo

Parejas de habla hispana que quieren salir de la rutina, hacer planes diferentes y guardar recuerdos.

### Casos de uso principales

- Parejas jóvenes que buscan ideas de citas.
- Parejas que conviven y quieren reconectar.
- Parejas con poco tiempo que necesitan planes sencillos.
- Personas que quieren regalar una experiencia digital a su pareja.
- Parejas que quieren crear un álbum de recuerdos anual.

---

## 5. Propuesta de valor

La app combina cuatro piezas:

1. **Planes guiados:** 30 planes con instrucciones, duración, presupuesto y parte original.
2. **Personalización:** recomendaciones según ciudad, presupuesto, gustos, tiempo y preferencias.
3. **Recuerdos:** cada plan puede guardarse con foto, fecha, lugar, valoración y texto.
4. **Álbum imprimible:** generación de un libro/álbum con los recuerdos completados.

Diferenciación clave:

> Cada plan debe tener una parte original obligatoria: una pregunta, ritual, reto, dinámica o gesto emocional que lo haga distinto.

---

## 6. Stack tecnológico recomendado

### Frontend

- React.
- TypeScript.
- Vite.
- React Router.
- Zustand para estado global simple.
- TanStack Query para llamadas a APIs.
- React Hook Form + Zod para formularios y validación.
- Tailwind CSS para estilos.
- Framer Motion para microinteracciones.

### Mobile wrapper

- Capacitor.
- Capacitor Push Notifications.
- Capacitor Local Notifications.
- Capacitor Geolocation.
- Capacitor Camera.
- Capacitor Share.
- Capacitor Preferences o SQLite para persistencia local.

### Backend recomendado

MVP simple:

- Supabase.
- Supabase Auth.
- Supabase Postgres.
- Supabase Storage para fotos.
- Supabase Edge Functions para integraciones externas.

Alternativa:

- Firebase Auth.
- Firestore.
- Firebase Storage.
- Cloud Functions.

### Mapas y lugares cercanos

Opciones:

- Google Places API.
- Mapbox + Foursquare Places.
- OpenStreetMap/Nominatim para MVP limitado.

Para producción se recomienda Google Places API o Foursquare por calidad de resultados locales.

### Álbum/libro imprimible

Opciones:

- Generar PDF propio con React PDF o server-side PDF.
- Exportar imágenes/páginas para imprimir.
- Integración afiliada externa con Hofmann u otro proveedor.
- En MVP, generar PDF descargable y enlazar a proveedor de impresión.

---

## 7. Arquitectura general

```txt
React + Vite + TypeScript
        |
        | Capacitor
        v
 iOS / Android
        |
        v
Supabase / Firebase
        |
        |-- Auth
        |-- Base de datos
        |-- Storage de fotos
        |-- Edge Functions
        |
        |-- APIs externas
              |-- Places API
              |-- Afiliados
              |-- PDF/álbum
```

---

## 8. Entidades principales

### User

```ts
export type User = {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
};
```

### Couple

```ts
export type Couple = {
  id: string;
  name: string;
  members: string[];
  city?: string;
  budgetPreference?: 'gratis' | 'bajo' | 'medio' | 'alto' | 'variable';
  preferredLocation?: 'en_casa' | 'exterior' | 'mixto' | 'equilibrado';
  hasChildren?: boolean;
  interests: string[];
  createdAt: string;
};
```

### Plan

```ts
export type CouplePlan = {
  id: string;
  plan: string;
  descripcion: string;
  parteOriginal: string;
  presupuesto: 'gratis' | 'bajo' | 'medio' | 'alto' | 'variable';
  costeEstimado: string;
  ubicacion: 'en casa' | 'exterior' | 'mixto';
  categoria: string[];
  duracion: string;
  energia: 'tranquilo' | 'moderado' | 'activo';
  necesitaReserva: boolean | 'opcional' | 'depende';
  idealPara: string[];
  materiales: string[];
  ayudaCercaDeTi: string[];
  afiliadosSugeridos: string[];
  preguntaRecuerdo: string;
  textoCompartir: string;
  albumPrompt: string;
  dificultadPreparacion?: 'baja' | 'media' | 'alta';
  momentoIdeal?: Array<'mañana' | 'tarde' | 'noche' | 'fin de semana'>;
  climaIdeal?: Array<'soleado' | 'lluvia' | 'cualquiera'>;
  nivelIntimidad?: 'ligero' | 'medio' | 'profundo';
  aptoConHijos?: boolean;
  aptoLargaDistancia?: boolean;
  premium?: boolean;
};
```

### CompletedPlan / Memory

```ts
export type CompletedPlan = {
  id: string;
  coupleId: string;
  planId: string;
  date: string;
  locationName?: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  note: string;
  rating: 1 | 2 | 3 | 4 | 5;
  sharedCount: number;
  createdAt: string;
  updatedAt: string;
};
```

### ReminderSettings

```ts
export type ReminderSettings = {
  id: string;
  coupleId: string;
  enabled: boolean;
  frequency: 'weekly' | 'monthly' | 'custom';
  dayOfMonth?: number;
  dayOfWeek?: number;
  time: string;
  message?: string;
  notifyBothMembers: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### AffiliateLink

```ts
export type AffiliateLink = {
  id: string;
  planId?: string;
  category: string;
  label: string;
  url: string;
  provider: string;
  active: boolean;
};
```

---

## 9. Modelo inicial de planes

La app debe incluir 30 planes de inicio. Cada plan debe tener:

- Nombre claro.
- Descripción breve.
- Parte original.
- Presupuesto.
- Coste estimado.
- Ubicación: en casa, exterior o mixto.
- Categorías.
- Duración.
- Nivel de energía.
- Si necesita reserva.
- Materiales.
- Sugerencias para buscar lugares cerca.
- Posibles afiliados.
- Pregunta para el recuerdo.
- Texto sugerido para compartir.
- Prompt o guía para la foto del álbum.

Ejemplo:

```ts
const examplePlan: CouplePlan = {
  id: 'plan_001',
  plan: 'Picnic de película bajo las estrellas',
  descripcion: 'Preparad una cena sencilla y ved una película al aire libre, en un parque, terraza, playa o mirador.',
  parteOriginal: 'Cada uno escribe antes una escena de vuestra relación que merecería estar en una película.',
  presupuesto: 'bajo',
  costeEstimado: '5-20€',
  ubicacion: 'exterior',
  categoria: ['romantico', 'low-cost', 'noche', 'recuerdo'],
  duracion: '2-3 horas',
  energia: 'tranquilo',
  necesitaReserva: false,
  idealPara: ['reconectar', 'celebrar', 'salir de la rutina'],
  materiales: ['manta', 'comida sencilla', 'bebidas', 'móvil/tablet', 'auriculares o altavoz'],
  ayudaCercaDeTi: ['miradores', 'parques', 'zonas de picnic', 'playas'],
  afiliadosSugeridos: ['manta picnic', 'luces LED', 'cesta picnic', 'proyector portátil'],
  preguntaRecuerdo: '¿Qué momento de la noche guardarías para siempre?',
  textoCompartir: 'Hemos completado nuestro picnic de película bajo las estrellas ✨',
  albumPrompt: 'Foto de los dos con la manta, la comida y el cielo de fondo.',
  dificultadPreparacion: 'baja',
  momentoIdeal: ['noche', 'fin de semana'],
  climaIdeal: ['soleado'],
  nivelIntimidad: 'medio',
  aptoConHijos: false,
  aptoLargaDistancia: false,
  premium: false,
};
```

---

## 10. Flujo principal de usuario

### 10.1 Onboarding

Objetivo: explicar la propuesta rápidamente.

Contenido:

- Claim principal: “Contigo, cada momento es mejor”.
- Subtítulo: “30 planes para vivir, recordar y disfrutar en pareja”.
- CTA: “Empezar”.
- Link secundario: “Iniciar sesión”.

### 10.2 Cuestionario inicial

Preguntas sugeridas:

- ¿Dónde vivís?
- ¿Cuál es vuestro presupuesto habitual?
- ¿Preferís planes en casa o salir?
- ¿Tenéis hijos?
- ¿Qué os gusta hacer?
  - Gastronomía.
  - Música.
  - Naturaleza.
  - Cultura.
  - Relax.
  - Aventura.
  - Juegos.
  - Creatividad.

Resultado: personalizar recomendaciones y filtros.

### 10.3 Home

Elementos:

- Saludo de pareja.
- Plan recomendado para hoy.
- Progreso: X/30 planes completados.
- Próximo recordatorio.
- CTA: “Ver todos los planes”.
- Navegación inferior.

### 10.4 Lista de planes

Elementos:

- Tabs/filtros por categoría.
- Lista de cards con imagen, nombre, número de plan, presupuesto y ubicación.
- Indicador de completado.
- Buscador opcional.

Filtros mínimos:

- Todos.
- En casa.
- Exterior.
- Románticos.
- Gratis / bajo coste.
- Aventura.
- Gastronómicos.
- Profundos.

### 10.5 Detalle del plan

Elementos:

- Imagen hero.
- Título.
- Chips de categorías.
- Descripción.
- Parte original destacada.
- Duración.
- Presupuesto.
- Materiales.
- Bloque “¿Dónde hacerlo?” con mapa o CTA a lugares cercanos.
- Bloque de enlaces afiliados relacionados.
- CTA: “Marcar como hecho”.

### 10.6 Lugares cercanos

Función:

Según las palabras clave del campo `ayudaCercaDeTi`, buscar lugares próximos al usuario.

Ejemplo:

Para un plan de picnic:

- Miradores.
- Parques.
- Playas.
- Zonas de picnic.

Elementos:

- Buscador.
- Chips de tipos de lugar.
- Lista de lugares.
- Distancia.
- Tiempo aproximado.
- Botón de guardar lugar.
- Botón de abrir en mapas.

### 10.7 Plan completado

Formulario:

- Fecha.
- Lugar.
- Foto principal.
- Fotos extra.
- Texto: “¿Cómo ha ido?”
- Valoración de 1 a 5 estrellas.
- Checkbox: “Añadir al álbum”.
- CTA: “Guardar recuerdo”.

### 10.8 Recuerdo guardado

Elementos:

- Imagen principal.
- Título del plan.
- Fecha.
- Lugar.
- Nota.
- Valoración.
- Botones compartir:
  - Instagram.
  - WhatsApp.
  - Facebook.
  - Más.
- CTA: “Ver todos los recuerdos”.

### 10.9 Recordatorios

La app debe incluir un recordatorio para hacer al menos un plan al mes, configurable por la pareja.

Configuración:

- Activar/desactivar recordatorios.
- Frecuencia:
  - Semanal.
  - Mensual.
  - Personalizada.
- Día del mes o día de la semana.
- Hora.
- Mensaje personalizado.
- Notificar a ambos miembros.

Mensaje por defecto:

> Es hora de vuestro plan mensual 💕 Dedicad tiempo el uno al otro.

La app debe usar notificaciones locales para el MVP y push notifications si hay cuenta compartida o multiusuario.

### 10.10 Álbum/libro

Objetivo:

Permitir crear un libro visual con los planes completados.

MVP:

- Seleccionar recuerdos.
- Ordenar por fecha o manualmente.
- Elegir plantilla.
- Generar PDF.
- Mostrar enlace afiliado a Hofmann u otro proveedor de impresión.

Futuro:

- Integración directa con proveedor.
- Portada editable.
- Dedicatoria.
- Índice de planes.
- Mapa de recuerdos.

---

## 11. Navegación principal

Bottom navigation con cinco secciones:

1. Inicio.
2. Planes.
3. Botón central “+” para completar/crear recuerdo rápido.
4. Recuerdos.
5. Perfil.

Rutas sugeridas:

```txt
/
/onboarding
/onboarding/preferences
/home
/plans
/plans/:planId
/plans/:planId/nearby
/plans/:planId/complete
/memories
/memories/:memoryId
/reminders
/album
/profile
/settings
```

---

## 12. Diseño visual

### Estilo

- Limpio.
- Emocional.
- Moderno.
- Similar a app lifestyle/wellness.
- Mucho espacio en blanco.
- Cards redondeadas.
- Tonos suaves.
- Imágenes cálidas.

### Paleta sugerida

```css
:root {
  --color-primary: #ec4f84;
  --color-primary-dark: #d93b70;
  --color-primary-light: #ffe4ee;
  --color-background: #fffafc;
  --color-surface: #ffffff;
  --color-text: #171923;
  --color-muted: #718096;
  --color-border: #edf2f7;
  --color-success: #48bb78;
  --color-warning: #f6ad55;
}
```

### Tipografía

- Inter, SF Pro o similar.
- Títulos contundentes.
- Texto de cuerpo legible.

### Componentes base

- Button.
- Card.
- PlanCard.
- MemoryCard.
- CategoryChip.
- ProgressCard.
- ReminderCard.
- PhotoUploader.
- RatingInput.
- LocationPicker.
- ShareSheet.
- BottomNav.

---

## 13. Funcionalidades MVP

### Imprescindible

- Onboarding.
- Cuestionario de preferencias.
- Listado de 30 planes.
- Detalle de cada plan.
- Filtros por categoría.
- Marcar plan como completado.
- Guardar recuerdo con foto, fecha, texto y valoración.
- Ver listado de recuerdos.
- Compartir recuerdo usando Capacitor Share.
- Configurar recordatorio mensual.
- Notificaciones locales.
- Buscar lugares cercanos para ciertos planes.
- Pantalla de álbum con CTA para exportar o imprimir.

### No imprescindible para MVP

- Cuenta compartida en tiempo real.
- Chat entre pareja.
- Integración directa con Hofmann.
- Pago in-app.
- IA generativa.
- Sincronización avanzada entre dispositivos.

---

## 14. Funcionalidades premium futuras

- Más de 30 planes.
- Packs especiales: San Valentín, aniversario, viajes, padres, distancia.
- Modo sorpresa.
- Planes generados según gustos.
- Álbum premium con plantillas avanzadas.
- Exportación PDF en alta calidad.
- Retos mensuales.
- Sincronización de pareja.
- Calendario compartido.
- Descuentos afiliados.
- Widgets de cuenta atrás.
- Mapa de recuerdos.

---

## 15. Monetización

### Modelo recomendado

MVP:

- App gratuita con 5-8 planes desbloqueados.
- Pago único para desbloquear los 30 planes.
- Afiliación en productos y experiencias.
- Afiliación o enlace de impresión del álbum.

Futuro:

- Suscripción opcional para nuevos planes mensuales, packs premium, sincronización y álbum avanzado.
- Compra única de packs.
- Regalos digitales.

### Ejemplos

- Pack 30 planes: 4,99 € - 9,99 €.
- Pack San Valentín: 2,99 €.
- Álbum premium exportable: 4,99 €.
- Suscripción premium: 2,99 € - 4,99 €/mes.

---

## 16. Consideraciones para stores

### App Store / Google Play

La app debe cumplir con:

- Política de privacidad.
- Gestión clara de permisos.
- Explicación de uso de ubicación.
- Explicación de uso de cámara/fotos.
- Explicación de notificaciones.
- Sistema de eliminación de cuenta si hay login.
- Transparencia en enlaces afiliados.
- Transparencia en compras in-app si existen.

### Permisos Capacitor

- Cámara: para añadir fotos a recuerdos.
- Fotos/galería: para seleccionar imágenes.
- Ubicación: para buscar sitios cercanos.
- Notificaciones: para recordatorios.
- Share: para compartir recuerdos.

---

## 17. Privacidad

Datos sensibles:

- Fotos personales.
- Notas privadas.
- Ubicaciones.
- Información de pareja.

Requisitos:

- No compartir recuerdos públicamente sin acción explícita.
- Permitir borrar recuerdos.
- Permitir borrar cuenta.
- Guardar ubicación solo si el usuario la elige.
- Separar contenido privado de plantillas para redes sociales.
- Mostrar aviso si un enlace es afiliado.

---

## 18. Estructura de carpetas sugerida

```txt
src/
  app/
    router.tsx
    providers.tsx
  components/
    ui/
    plans/
    memories/
    reminders/
    album/
    layout/
  data/
    plans.ts
  features/
    onboarding/
    home/
    plans/
    memories/
    reminders/
    nearby/
    album/
    profile/
  hooks/
    useGeolocation.ts
    useNotifications.ts
    useShare.ts
  services/
    placesService.ts
    notificationService.ts
    storageService.ts
    affiliateService.ts
    albumService.ts
  store/
    useAppStore.ts
  types/
    plan.ts
    memory.ts
    reminder.ts
  styles/
    globals.css
```

---

## 19. Criterios de aceptación del MVP

La primera versión se considerará completa si:

- El usuario puede completar onboarding y preferencias.
- El usuario puede ver 30 planes.
- El usuario puede filtrar planes.
- El usuario puede abrir el detalle de un plan.
- El usuario puede buscar lugares cercanos relacionados con un plan.
- El usuario puede marcar un plan como hecho.
- El usuario puede guardar foto, fecha, nota y valoración.
- El usuario puede ver el recuerdo guardado.
- El usuario puede compartir un recuerdo.
- El usuario puede configurar un recordatorio mensual.
- La app lanza notificaciones locales.
- Existe una pantalla de álbum/libro.
- La app funciona correctamente como PWA/web.
- La app puede compilarse con Capacitor para iOS y Android.

---

## 20. Roadmap sugerido

### Fase 1 — Prototipo visual

- Crear diseño responsive mobile-first.
- Crear navegación entre pantallas mock.
- Cargar planes desde archivo local.
- Usar imágenes placeholder.

### Fase 2 — MVP local

- Persistir recuerdos localmente.
- Añadir subida/selección de fotos.
- Añadir recordatorios locales.
- Añadir compartir nativo.
- Añadir búsqueda básica de lugares.

### Fase 3 — Backend

- Login.
- Sincronización.
- Storage de fotos.
- Pareja compartida.
- Backup de recuerdos.

### Fase 4 — Monetización

- Premium.
- Afiliados.
- Exportación PDF.
- Página de álbum.

### Fase 5 — Stores

- Iconos y splash screens.
- Builds iOS/Android.
- Política de privacidad.
- Testing.
- Publicación.

---

## 21. Instrucciones para la IA desarrolladora

Crear una aplicación web mobile-first con React, TypeScript, Vite y Capacitor.

Priorizar:

1. Experiencia visual similar a la imagen de referencia.
2. Arquitectura limpia y escalable.
3. Datos de planes tipados.
4. Componentes reutilizables.
5. Funcionalidad MVP antes que backend complejo.
6. Preparación real para compilar con Capacitor.

No implementar todavía lógica compleja de pagos ni integración directa con imprentas. Dejar servicios desacoplados para añadirlos después.

La app debe sentirse como un producto emocional, cálido y de regalo, no como una simple lista de tareas.
