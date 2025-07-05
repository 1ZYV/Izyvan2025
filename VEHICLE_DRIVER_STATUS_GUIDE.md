# Guía de Estados de Vehículos y Conductores

Este documento explica el significado de cada estado disponible en el sistema de gestión de vehículos y conductores para que los usuarios finales puedan entender y utilizar correctamente la plataforma.

## Estados de Vehículos

### 🟢 Disponible (`available`)

- **Significado**: El vehículo está listo para ser asignado a un servicio
- **Estado visual**: Badge verde sólido con ✅
- **Cuándo se usa**:
  - El vehículo no está en uso actualmente
  - Ha completado su último servicio
  - Está en buenas condiciones operativas
  - Documentos al día (SOAT, revisión técnica, etc.)
- **Acciones permitidas**:
  - Asignar a una solicitud de servicio
  - Marcar como ocupado manualmente
  - Enviar a mantenimiento
  - Desactivar temporalmente

### 🟡 Ocupado (`busy`)

- **Significado**: El vehículo está actualmente prestando un servicio o en ruta
- **Estado visual**: Badge amarillo sólido con 🚗
- **Cuándo se usa**:
  - Ha sido asignado a una solicitud de servicio aceptada
  - Está transportando pasajeros
  - En ruta hacia el punto de recogida o destino
  - Realizando cualquier actividad relacionada con un servicio activo
- **Acciones permitidas**:
  - Marcar como disponible (cuando complete el servicio)
  - Ver detalles del servicio actual
  - Contactar al conductor

### 🔴 En Mantenimiento (`maintenance`)

- **Significado**: El vehículo está fuera de servicio por reparaciones o mantenimiento
- **Estado visual**: Badge rojo sólido con 🔧
- **Cuándo se usa**:
  - Mantenimiento preventivo programado
  - Reparaciones necesarias
  - Inspección técnica
  - Cualquier trabajo que impida su uso normal
- **Acciones permitidas**:
  - Marcar como disponible (cuando termine el mantenimiento)
  - Actualizar información de mantenimiento
  - Desactivar si es necesario

### ⚫ Inactivo (`inactive`)

- **Significado**: El vehículo está temporalmente fuera de la flota activa
- **Estado visual**: Badge gris con borde con ⏸️
- **Cuándo se usa**:
  - Documentos vencidos
  - Problemas legales o administrativos
  - Decisión administrativa de no usar el vehículo
  - Fuera de temporada o rotación
- **Acciones permitidas**:
  - Activar vehículo (volver a disponible)
  - Actualizar documentación
  - Ver historial

## Estados de Conductores

### 🟢 Disponible (`available`)

- **Significado**: El conductor está listo para ser asignado a un servicio
- **Estado visual**: Badge verde sólido con ✅
- **Cuándo se usa**:
  - No está conduciendo actualmente
  - Ha completado su último servicio
  - Está en horario de trabajo
  - Licencia y documentos vigentes
- **Acciones permitidas**:
  - Asignar a una solicitud de servicio
  - Marcar como ocupado manualmente
  - Programar descanso
  - Desactivar temporalmente

### 🟡 Ocupado (`busy`)

- **Significado**: El conductor está actualmente prestando un servicio
- **Estado visual**: Badge amarillo sólido con 🚙
- **Cuándo se usa**:
  - Ha sido asignado a una solicitud de servicio aceptada
  - Está conduciendo o atendiendo pasajeros
  - En ruta hacia el punto de recogida o destino
  - Realizando actividades relacionadas con un servicio activo
- **Acciones permitidas**:
  - Marcar como disponible (cuando complete el servicio)
  - Ver detalles del servicio actual
  - Contactar directamente

### 📴 Desconectado (`offline`)

- **Significado**: El conductor no está disponible temporalmente
- **Estado visual**: Badge gris con borde con 📴
- **Cuándo se usa**:
  - Fuera de horario de trabajo
  - En descanso o break
  - No responde a comunicaciones
  - Decidió desconectarse temporalmente
- **Acciones permitidas**:
  - Contactar para verificar disponibilidad
  - Marcar como disponible cuando se conecte
  - Ver último horario activo

### ⚫ Inactivo (`inactive`)

- **Significado**: El conductor está temporalmente fuera del equipo activo
- **Estado visual**: Badge gris con borde con ⏸️
- **Cuándo se usa**:
  - Licencia vencida o suspendida
  - Problemas disciplinarios o administrativos
  - Licencia médica o personal
  - Decisión administrativa de no asignar servicios
- **Acciones permitidas**:
  - Activar conductor (volver a disponible)
  - Actualizar documentación
  - Ver historial de servicios

## Flujo de Estados Típico

### Para Vehículos:

1. **Disponible** → **Ocupado** (cuando se asigna a un servicio)
2. **Ocupado** → **Disponible** (cuando completa el servicio)
3. **Disponible** → **Mantenimiento** (mantenimiento programado)
4. **Mantenimiento** → **Disponible** (mantenimiento completado)
5. **Cualquier estado** → **Inactivo** (decisión administrativa)

### Para Conductores:

1. **Disponible** → **Ocupado** (cuando se asigna a un servicio)
2. **Ocupado** → **Disponible** (cuando completa el servicio)
3. **Disponible** → **Desconectado** (fin de turno o descanso)
4. **Desconectado** → **Disponible** (inicio de turno)
5. **Cualquier estado** → **Inactivo** (decisión administrativa)

## Consideraciones Importantes

### Asignación Automática

- Solo vehículos y conductores en estado **Disponible** pueden ser asignados automáticamente a servicios
- El sistema filtra automáticamente recursos no disponibles

### Notificaciones

- Los cambios de estado pueden generar notificaciones automáticas
- Estados críticos (mantenimiento, inactivo) alertan a supervisores

### Reportes

- Los estados se utilizan para generar reportes de disponibilidad
- Permiten análisis de utilización de la flota

### Buenas Prácticas

- Actualizar estados en tiempo real para mantener información precisa
- Usar estados descriptivos para facilitar la gestión
- Revisar regularmente vehículos y conductores inactivos
- Documentar razones de cambios de estado cuando sea necesario

---

_Este documento debe consultarse regularmente para garantizar el uso correcto del sistema de estados y optimizar la gestión de la flota._
