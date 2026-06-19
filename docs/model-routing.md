# Politica de enrutado de modelos

Este proyecto quiere minimizar coste y uso de tokens sin perder calidad en decisiones importantes.

## Regla principal

Usar modelos potentes para pensar y coordinar. Usar modelos baratos para ejecutar.

La implementacion rutinaria no debe hacerse con el modelo mas caro cuando exista una opcion mas barata suficiente.

## Enrutado deseado

### Orquestacion

Modelo preferido:
- GPT 5.5 o el modelo mas capaz disponible.

Usar para:
- interpretar peticiones ambiguas
- decidir arquitectura
- dividir tareas grandes
- revisar riesgos
- elegir estrategia de migracion
- hacer code review complejo
- validar decisiones de producto o UX con impacto amplio

### Implementacion

Modelo preferido:
- GPT 5.4
- GPT 5.4 mini cuando el cambio sea pequeno o mecanico

Usar para:
- editar archivos
- crear componentes siguiendo un patron ya decidido
- aplicar refactors acotados
- escribir tests concretos
- ajustar estilos
- ejecutar verificaciones
- corregir errores de compilacion claros

### Subagentes

Modelo por defecto:
- GPT 5.4 mini

Subir a GPT 5.4 si:
- el subagente necesita leer mucho contexto
- la tarea tiene varias dependencias entre archivos
- hay riesgo de romper comportamiento existente

Evitar GPT 5.5 en subagentes salvo que el usuario lo pida o que la tarea sea de analisis estrategico.

## Politica practica

Antes de empezar una tarea:
- decidir si la tarea es de orquestacion, implementacion o revision
- usar el modelo mas barato que pueda resolverla con seguridad
- reservar el modelo mas potente para los puntos donde aporta criterio real

Durante una tarea:
- mantener el contexto compartido en archivos como `AGENTS.md` y docs del proyecto
- preferir instrucciones concretas y cambios pequenos
- evitar releer archivos grandes si hay documentacion local suficiente
- no lanzar subagentes caros para trabajo mecanico

Al terminar:
- documentar cualquier decision que ayude a reducir contexto en la siguiente conversacion
- avisar si se tuvo que usar un modelo mas caro por una razon concreta

## Limitacion importante

Estos archivos no garantizan por si solos que Codex, ChatGPT u otra plataforma cambien automaticamente de modelo. Solo establecen la politica del proyecto.

Si la herramienta ofrece seleccion explicita de modelo o subagentes con modelo configurable, seguir esta politica. Si no existe esa capacidad en la sesion actual, la IA debe avisar al usuario cuando sea relevante y continuar con la opcion disponible mas razonable.
