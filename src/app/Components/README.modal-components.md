# Componentes Modal para Gestión de Recursos

Este directorio contiene los componentes modales para la creación de vehículos y conductores en el sistema IzyTracking.

## 📋 **Estructura Organizada**

### **AddVehicleModal**

- `add-vehicle-modal.component.ts` - Componente principal
- `add-vehicle-modal.component.html` - Template del modal
- `add-vehicle-modal.component.css` - Estilos del modal
- `index.ts` - Exportaciones del componente

### **AddDriverModal**

- `add-driver-modal.component.ts` - Componente principal
- `add-driver-modal.component.html` - Template del modal
- `add-driver-modal.component.css` - Estilos del modal
- `index.ts` - Exportaciones del componente

## 🔧 **Características Técnicas**

### **Arquitectura Moderna Angular 20+**

- ✅ **Standalone Components** - Sin NgModules
- ✅ **Signals** - Estado reactivo moderno
- ✅ **Control Flow** - Sintaxis `@if`, `@for`
- ✅ **OnPush Change Detection** - Optimización de rendimiento
- ✅ **Reactive Forms** - Validación robusta

### **Validación Unificada**

- ✅ **Utilidades compartidas** en `/Utils/form-validation.utils.ts`
- ✅ **Tipos centralizados** en `/Types/form.types.ts`
- ✅ **Validadores personalizados** para formatos específicos
- ✅ **Mensajes de error consistentes**

### **Tipos y Constantes**

- ✅ **Interfaces compartidas** para formularios
- ✅ **Configuración centralizada** de validaciones
- ✅ **Opciones de select** predefinidas
- ✅ **Constantes reutilizables**

## 🎯 **Flujo de Datos**

### **AddVehicleModal**

```typescript
1. Usuario abre modal → showAddVehicleModal.set(true)
2. Llena formulario → Validación en tiempo real
3. Envía datos → Sanitización automática
4. Crea vehículo → Genera ID único
5. Emite evento → vehicleCreated.emit()
6. Actualiza lista → Refresh automático
```

### **AddDriverModal**

```typescript
1. Usuario abre modal → showAddDriverModal.set(true)
2. Llena formulario → Validación en tiempo real
3. Selecciona opciones → Languages + VehicleTypes
4. Envía datos → Sanitización automática
5. Crea conductor → Genera ID único
6. Emite evento → driverCreated.emit()
7. Actualiza lista → Refresh automático
```

## 🧪 **Validaciones Implementadas**

### **Vehículos**

- **Placa**: Formato ABC-123
- **Marca/Modelo**: Mínimo 2 caracteres
- **Año**: Entre 1990 y año actual + 1
- **Capacidad**: Entre 1 y 50 pasajeros
- **Kilometraje**: Número positivo

### **Conductores**

- **Licencia**: Formato LIC-12345
- **Teléfono**: Formato internacional
- **Email**: Validación estándar
- **Experiencia**: Entre 0 y 50 años
- **Idiomas**: Mínimo 1 seleccionado
- **Tipos de vehículo**: Mínimo 1 seleccionado

## 🔄 **Integración con Servicios**

### **VehiclesAndDriversService**

```typescript
// Métodos actualizados con utilidades
addVehicle() → generateUniqueId('vehicle')
addDriver() → generateUniqueId('driver')
```

### **Actualización de Signals**

- Automática al crear recursos
- Reactiva en toda la aplicación
- Consistente con el estado global

## 🎨 **Estilos Consistentes**

### **Design System**

- **Colores**: Paleta azul corporativa
- **Tipografía**: Jerarquía clara
- **Espaciado**: Grid system 8px
- **Componentes**: Botones, inputs, modals consistentes

### **Responsive Design**

- **Mobile First**: Adaptación automática
- **Breakpoints**: 768px para móviles
- **Layout**: Flexbox y Grid CSS

## 📝 **Uso de los Componentes**

### **En Templates**

```html
<!-- Modal de Vehículo -->
<cp-add-vehicle-modal [isOpen]="showAddVehicleModal()" (close)="onCloseAddVehicleModal()" (vehicleCreated)="onVehicleCreated($event)"></cp-add-vehicle-modal>

<!-- Modal de Conductor -->
<cp-add-driver-modal [isOpen]="showAddDriverModal()" (close)="onCloseAddDriverModal()" (driverCreated)="onDriverCreated($event)"></cp-add-driver-modal>
```

### **En Componentes**

```typescript
// Signals para control
showAddVehicleModal = signal<boolean>(false);
showAddDriverModal = signal<boolean>(false);

// Event handlers
onAddVehicle() { this.showAddVehicleModal.set(true); }
onAddDriver() { this.showAddDriverModal.set(true); }

// Manejo de creación
onVehicleCreated(vehicle: VehicleDetails) {
    // Lógica de actualización
}
```

## 🚀 **Próximas Mejoras**

1. **Validación de duplicados** (placas, licencias)
2. **Upload de imágenes** con preview
3. **Autocompletado** para marcas/modelos
4. **Validación de documentos** con APIs externas
5. **Modo de edición** para recursos existentes
