# Sistema de Gestión de Viajes y Servicios - Documentación Completa

Una aplicación Angular moderna y completa para la gestión de viajes, conductores, vehículos, servicios, tarifas, historial, facturas y métodos de pago. El sistema está diseñado con una arquitectura modular y profesional que facilita el mantenimiento y la extensibilidad.

## 📋 Tabla de Contenidos

1. [Visión General del Sistema](#-visión-general-del-sistema)
2. [Arquitectura y Estructura](#-arquitectura-y-estructura)
3. [Módulo de Autenticación](#-módulo-de-autenticación)
4. [Módulo de Viajes](#-módulo-de-viajes)
5. [Módulo de Conductores](#-módulo-de-conductores)
6. [Módulo de Vehículos](#-módulo-de-vehículos)
7. [Módulo de Guías](#-módulo-de-guías)
8. [Módulo de Servicios](#-módulo-de-servicios)
9. [Módulo de Tarifas](#-módulo-de-tarifas)
10. [Módulo de Historial](#-módulo-de-historial)
11. [Módulo de Facturas](#-módulo-de-facturas)
12. [Módulo de Métodos de Pago](#-módulo-de-métodos-de-pago)
13. [Dashboard y Panel de Control](#-dashboard-y-panel-de-control)
14. [Componentes UI Reutilizables](#-componentes-ui-reutilizables)
15. [Servicios del Sistema](#-servicios-del-sistema)
16. [Guards y Seguridad](#-guards-y-seguridad)
17. [Layouts y Estructuras](#-layouts-y-estructuras)
18. [Tipos y Definiciones](#-tipos-y-definiciones)
19. [Utilidades](#-utilidades)
20. [Requerimientos del Backend/API](#-requerimientos-del-backendapi)
21. [Instalación y Desarrollo](#-instalación-y-desarrollo)

---

## 🌟 Visión General del Sistema

Este sistema es una **plataforma integral de gestión de viajes y servicios de transporte** que permite a diferentes tipos de usuarios (administradores, agencias, proveedores) gestionar todos los aspectos relacionados con:

- **Planificación y seguimiento de viajes**
- **Gestión de conductores y vehículos**
- **Control de servicios y tarifas**
- **Historial completo de operaciones**
- **Facturación y métodos de pago**
- **Reportes y estadísticas**

### Tipos de Usuario

- **Admin**: Control total del sistema, gestión de usuarios y configuraciones globales
- **Agency**: Gestión de viajes, clientes y servicios para agencias de turismo
- **Provider**: Gestión de flota, conductores y servicios para proveedores de transporte

---

## 🏗️ Arquitectura y Estructura

El sistema sigue una **arquitectura modular** con separación clara de responsabilidades:

```
src/app/
├── Components/          # Componentes UI reutilizables
├── Pages/              # Páginas principales de la aplicación
├── Services/           # Servicios para comunicación con APIs
├── Guards/             # Guardias de autenticación y autorización
├── Layouts/            # Estructuras de diseño
├── Types/              # Definiciones de tipos TypeScript
└── Utils/              # Utilidades y helpers
```

---

## 🔐 Módulo de Autenticación

### Propósito

Gestiona toda la funcionalidad de autenticación, autorización y control de acceso del sistema.

### Componentes Principales

#### LoginComponent (`Pages/Auth/login.component.ts`)

- **Funcionalidad**: Formulario de inicio de sesión
- **Lógica interna**:
  - Validación de campos (email, password)
  - Estado de carga durante autenticación
  - Manejo de errores de credenciales
  - Redirección automática tras login exitoso
- **Flujo de datos**:
  1. Usuario ingresa credenciales
  2. Componente valida campos básicos
  3. Llama al AuthService
  4. Recibe respuesta y maneja estados
  5. Redirige al dashboard o muestra error

### Servicios

#### AuthService (`Services/Auth/auth.service.ts`)

- **Propósito**: Gestión centralizada de autenticación
- **Funcionalidades**:
  - Login/logout de usuarios
  - Gestión de tokens JWT
  - Estado reactivo del usuario actual
  - Persistencia de sesión en localStorage
  - Restauración automática de sesión
- **Estado interno**:
  ```typescript
  currentUserSubject: BehaviorSubject<User | null>;
  currentUser$: Observable<User | null>;
  ```

### Guards de Seguridad

#### AuthGuard (`Guards/Auth/auth.guard.ts`)

- **Por qué**: Proteger rutas que requieren autenticación
- **Cómo**: Verifica token válido antes de permitir acceso
- **Lógica**: Redirige a login si no hay usuario autenticado

#### RoleGuard (`Guards/Auth/role.guard.ts`)

- **Por qué**: Control de acceso basado en roles
- **Cómo**: Verifica que el usuario tenga el rol requerido
- **Lógica**: Permite/deniega acceso según roles del usuario

#### ProviderGuard (`Guards/Auth/provider.guard.ts`)

- **Por qué**: Acceso específico para proveedores de transporte
- **Cómo**: Valida rol 'provider' específicamente
- **Lógica**: Restringe acceso a funcionalidades de proveedor

### Endpoints del Backend Requeridos

#### POST /api/auth/login

```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "Juan Pérez",
    "email": "user@example.com",
    "roles": ["agency"]
  }
}
```

#### POST /api/auth/logout

```json
// Request (con Authorization header)
{}

// Response
{
  "message": "Logout exitoso"
}
```

#### GET /api/auth/me

```json
// Response
{
  "user": {
    "id": "user-123",
    "name": "Juan Pérez",
    "email": "user@example.com",
    "roles": ["agency"]
  }
}
```

---

## 🚗 Módulo de Viajes

### Propósito

Núcleo del sistema - gestiona la planificación, seguimiento y control de todos los viajes.

### Componentes Principales

#### TravelsIndexComponent (`Pages/Travels/Index/index.component.ts`)

- **Funcionalidad**: Lista principal de viajes
- **Lógica interna**:
  - Carga lista de viajes del usuario/empresa
  - Filtrado por estado, fecha, destino
  - Paginación de resultados
  - Estados de carga y vacío
- **Flujo de datos**:
  1. Carga inicial de viajes
  2. Suscripción a cambios de estado
  3. Actualización reactiva de la UI
  4. Navegación a detalles de viaje

#### TravelCreateComponent (`Pages/Travels/Create/`)

- **Funcionalidad**: Creación de nuevos viajes
- **Lógica**:
  - Formulario de múltiples pasos
  - Selección de origen/destino
  - Configuración de fechas y horarios
  - Asignación de conductor/vehículo
  - Cálculo de precios

#### TravelShowComponent (`Pages/Travels/Show/`)

- **Funcionalidad**: Vista detallada de un viaje específico
- **Lógica**:
  - Información completa del viaje
  - Seguimiento en tiempo real
  - Mapa interactivo
  - Datos del conductor
  - Desglose de precios

### Servicios

#### TravelsService (`Services/Travels/travels.service.ts`)

- **Propósito**: Gestión completa de viajes
- **Funcionalidades**:
  - CRUD de viajes
  - Estados reactivos con signals
  - Seguimiento en tiempo real
  - Cálculos de precios y rutas
  - Gestión de estados de viaje

### Componentes UI Especializados

#### TravelCardComponent (`Components/TravelCard/`)

- **Por qué**: Representación visual consistente de viajes
- **Funcionalidad**: Tarjeta con información resumida de viaje
- **Datos mostrados**: Estado, ruta, fecha, precio, conductor

#### TravelMapComponent (`Components/TravelMap/`)

- **Por qué**: Visualización geográfica de rutas
- **Funcionalidad**: Mapa interactivo con puntos de origen/destino
- **Características**: Zoom, marcadores, rutas trazadas

#### TravelRouteComponent (`Components/TravelRoute/`)

- **Por qué**: Información detallada de rutas
- **Funcionalidad**: Pasos de la ruta, tiempos, distancias
- **Características**: Actualizaciones en tiempo real

### Estados de Viaje

```typescript
type TravelStatus =
  | "pending" // Pendiente de confirmación
  | "confirmed" // Confirmado, esperando inicio
  | "in_progress" // En curso
  | "completed" // Completado exitosamente
  | "cancelled" // Cancelado
  | "delayed"; // Retrasado
```

### Endpoints del Backend Requeridos

#### GET /api/travels

```json
// Response
{
  "travels": [
    {
      "id": "travel-123",
      "name": "Viaje a Cartagena",
      "status": "confirmed",
      "origin": {
        "name": "Bogotá",
        "coordinates": [4.711, -74.0721]
      },
      "destination": {
        "name": "Cartagena",
        "coordinates": [10.391, -75.4794]
      },
      "scheduledAt": "2024-07-15T08:00:00Z",
      "estimatedDuration": 540,
      "distance": 654.5,
      "price": {
        "base": 450000,
        "taxes": 85500,
        "total": 535500,
        "currency": "COP"
      },
      "driverId": "driver-456",
      "vehicleId": "vehicle-789"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

#### POST /api/travels

```json
// Request
{
  "name": "Viaje a Medellín",
  "origin": {
    "name": "Bogotá Centro",
    "address": "Carrera 7 #32-10",
    "coordinates": [4.711, -74.0721]
  },
  "destination": {
    "name": "Aeropuerto José María Córdova",
    "address": "Rionegro, Antioquia",
    "coordinates": [6.1645, -75.4233]
  },
  "scheduledAt": "2024-07-20T06:30:00Z",
  "passengers": 4,
  "vehicleType": "sedan",
  "notes": "Viaje ejecutivo, cliente VIP"
}
```

#### GET /api/travels/:id

#### PUT /api/travels/:id

#### DELETE /api/travels/:id

#### POST /api/travels/:id/assign-driver

#### POST /api/travels/:id/start

#### POST /api/travels/:id/complete

#### POST /api/travels/:id/cancel

---

## 👨‍💼 Módulo de Conductores

### Propósito

Gestión completa de conductores: registro, información, disponibilidad, rendimiento y asignaciones.

### Componentes Principales

#### DriversIndexComponent (`Pages/Drivers/Index/index.component.ts`)

- **Funcionalidad**: Lista y gestión de conductores
- **Estado actual**: Componente básico preparado para expansión
- **Funcionalidades planificadas**:
  - Lista de conductores con filtros
  - Estados de disponibilidad
  - Información de contacto
  - Historial de viajes
  - Calificaciones y comentarios

### Funcionalidades del Sistema de Conductores

#### Gestión de Perfiles

- **Información personal**: Nombre, teléfono, email, documentos
- **Documentación**: Licencia de conducir, certificados, seguros
- **Experiencia**: Años de experiencia, tipos de vehículos
- **Calificaciones**: Puntuación promedio, comentarios de pasajeros

#### Control de Disponibilidad

- **Estados**: Disponible, ocupado, desconectado, en descanso
- **Horarios**: Turnos preferidos, disponibilidad semanal
- **Localización**: Posición actual para asignaciones optimizadas

#### Rendimiento y Estadísticas

- **Viajes completados**: Total, mensuales, semanales
- **Ingresos**: Por período, comisiones, bonificaciones
- **Eficiencia**: Tiempo promedio por viaje, cancelaciones
- **Satisfacción**: Calificación promedio de pasajeros

### Endpoints del Backend Requeridos

#### GET /api/drivers

```json
// Response
{
  "drivers": [
    {
      "id": "driver-123",
      "name": "Carlos Rodríguez",
      "phone": "+57 300 123 4567",
      "email": "carlos@example.com",
      "licenseNumber": "12345678",
      "licenseExpiry": "2025-12-31",
      "status": "available",
      "rating": 4.8,
      "totalTrips": 1247,
      "experience": "5 años",
      "vehicleTypes": ["sedan", "suv"],
      "location": {
        "latitude": 4.711,
        "longitude": -74.0721
      },
      "availability": {
        "monday": { "start": "06:00", "end": "22:00" },
        "tuesday": { "start": "06:00", "end": "22:00" }
      }
    }
  ]
}
```

#### POST /api/drivers

#### GET /api/drivers/:id

#### PUT /api/drivers/:id

#### DELETE /api/drivers/:id

#### GET /api/drivers/:id/stats

#### POST /api/drivers/:id/availability

#### GET /api/drivers/available (conductores disponibles)

---

## 🚙 Módulo de Vehículos

### Propósito

Gestión de flota vehicular: registro, mantenimiento, disponibilidad, documentación y asignaciones.

### Funcionalidades del Sistema

#### Gestión de Flota

- **Información básica**: Marca, modelo, año, placa, color
- **Especificaciones**: Capacidad de pasajeros, tipo de combustible
- **Documentación**: SOAT, tecno-mecánica, seguros, tarjeta de propiedad
- **Estado**: Disponible, en servicio, en mantenimiento, fuera de servicio

#### Control de Mantenimiento

- **Preventivo**: Calendario de mantenimientos programados
- **Correctivo**: Registro de reparaciones y fallas
- **Kilometraje**: Control de recorrido y desgaste
- **Costos**: Gastos de mantenimiento, repuestos, mano de obra

#### Seguimiento Operacional

- **Ubicación**: GPS en tiempo real
- **Asignaciones**: Conductor actual, viajes programados
- **Rendimiento**: Consumo de combustible, eficiencia
- **Historial**: Viajes realizados, incidentes, reportes

### Endpoints del Backend Requeridos

#### GET /api/vehicles

```json
// Response
{
  "vehicles": [
    {
      "id": "vehicle-123",
      "plate": "ABC123",
      "brand": "Toyota",
      "model": "Prado",
      "year": 2022,
      "color": "Blanco",
      "capacity": 7,
      "fuelType": "gasoline",
      "status": "available",
      "mileage": 45000,
      "lastMaintenance": "2024-05-15",
      "nextMaintenance": "2024-08-15",
      "documents": {
        "soat": {
          "number": "SOAT123456",
          "expiry": "2025-06-30"
        },
        "technicalReview": {
          "expiry": "2025-03-15"
        }
      },
      "currentDriver": "driver-456",
      "location": {
        "latitude": 4.711,
        "longitude": -74.0721
      }
    }
  ]
}
```

#### POST /api/vehicles

#### GET /api/vehicles/:id

#### PUT /api/vehicles/:id

#### DELETE /api/vehicles/:id

#### GET /api/vehicles/:id/maintenance-history

#### POST /api/vehicles/:id/maintenance

#### GET /api/vehicles/available

---

## 📖 Módulo de Guías

### Propósito

Sistema de guías turísticos: información, especialidades, idiomas, disponibilidad y asignaciones a tours.

### Funcionalidades del Sistema

#### Gestión de Guías

- **Información personal**: Nombre, foto, biografía, experiencia
- **Especialidades**: Tipos de tours, áreas de expertise
- **Idiomas**: Idiomas que maneja y nivel de competencia
- **Certificaciones**: Licencias, cursos, acreditaciones

#### Control de Tours

- **Disponibilidad**: Calendar de disponibilidad
- **Asignaciones**: Tours activos y programados
- **Capacidad**: Número máximo de turistas por tour
- **Tarifas**: Precios por tipo de tour y duración

#### Rendimiento

- **Calificaciones**: Puntuación de turistas
- **Tours completados**: Estadísticas históricas
- **Especialización**: Tours más exitosos
- **Ingresos**: Comisiones y pagos

### Endpoints del Backend Requeridos

#### GET /api/guides

```json
// Response
{
  "guides": [
    {
      "id": "guide-123",
      "name": "María González",
      "photo": "https://example.com/photos/maria.jpg",
      "biography": "Guía turística certificada con 10 años de experiencia...",
      "languages": [
        { "language": "español", "level": "nativo" },
        { "language": "inglés", "level": "avanzado" },
        { "language": "francés", "level": "intermedio" }
      ],
      "specialties": ["historia", "cultura", "gastronomía"],
      "rating": 4.9,
      "totalTours": 523,
      "maxGroupSize": 15,
      "status": "available",
      "certifications": [
        {
          "name": "Guía Profesional de Turismo",
          "issuer": "MinCIT",
          "expiry": "2025-12-31"
        }
      ]
    }
  ]
}
```

---

## 🛠️ Módulo de Servicios

### Propósito

Catálogo y gestión de servicios ofrecidos: tipos, precios, configuraciones y disponibilidad.

### Funcionalidades del Sistema

#### Catálogo de Servicios

- **Tipos de servicio**: Transporte ejecutivo, turístico, eventos, aeropuerto
- **Configuraciones**: Duración, capacidad, características especiales
- **Precios**: Tarifas base, incrementos, descuentos
- **Disponibilidad**: Horarios, días, temporadas

#### Gestión de Ofertas

- **Paquetes**: Combinaciones de servicios
- **Promociones**: Descuentos temporales
- **Personalizaciones**: Servicios a medida
- **Add-ons**: Servicios adicionales

### Endpoints del Backend Requeridos

#### GET /api/services

```json
// Response
{
  "services": [
    {
      "id": "service-123",
      "name": "Transporte Ejecutivo",
      "description": "Servicio de transporte premium para ejecutivos",
      "category": "executive",
      "basePrice": 80000,
      "currency": "COP",
      "duration": 60,
      "maxPassengers": 4,
      "features": ["Vehículo de lujo", "Conductor bilingüe", "WiFi incluido", "Agua embotellada"],
      "availability": {
        "weekdays": true,
        "weekends": true,
        "holidays": false
      },
      "priceModifiers": {
        "nightTime": 1.3,
        "weekend": 1.2,
        "holiday": 1.5
      }
    }
  ]
}
```

---

## 💰 Módulo de Tarifas

### Propósito

Sistema de gestión de precios: tarifas base, modificadores, cálculos automáticos y estructuras de precios.

### Funcionalidades del Sistema

#### Estructura de Precios

- **Tarifas base**: Por tipo de servicio y vehículo
- **Modificadores**: Horario, día, temporada, distancia
- **Calculadora**: Algoritmos de cálculo automático
- **Monedas**: Soporte multi-moneda

#### Configuración Avanzada

- **Zonas**: Precios por zonas geográficas
- **Tiempo**: Tarifas por tiempo de espera
- **Distancia**: Cálculo por kilómetros recorridos
- **Combustible**: Ajustes por precios de combustible

### Endpoints del Backend Requeridos

#### GET /api/tariffs

```json
// Response
{
  "tariffs": [
    {
      "id": "tariff-123",
      "name": "Tarifa Estándar Bogotá",
      "serviceType": "standard",
      "vehicleType": "sedan",
      "zone": "bogota",
      "basePrice": 4500,
      "pricePerKm": 1200,
      "pricePerMinute": 350,
      "minimumFare": 12000,
      "waitingTime": 300,
      "modifiers": {
        "nightTime": { "start": "22:00", "end": "06:00", "multiplier": 1.3 },
        "weekend": { "multiplier": 1.2 },
        "surge": { "multiplier": 1.5, "conditions": ["high_demand", "weather"] }
      },
      "currency": "COP"
    }
  ]
}
```

#### POST /api/tariffs/calculate

```json
// Request
{
  "origin": {"lat": 4.7110, "lng": -74.0721},
  "destination": {"lat": 4.6097, "lng": -74.0817},
  "serviceType": "executive",
  "vehicleType": "suv",
  "dateTime": "2024-07-15T14:30:00Z",
  "passengers": 3
}

// Response
{
  "calculation": {
    "basePrice": 15000,
    "distancePrice": 18500,
    "timePrice": 8400,
    "modifiers": {
      "executive": 1.5,
      "applied": 22500
    },
    "taxes": 10260,
    "total": 74660,
    "currency": "COP",
    "breakdown": {
      "distance": 15.4,
      "estimatedTime": 24,
      "route": "Ruta sugerida vía Autopista Norte"
    }
  }
}
```

---

## 📈 Módulo de Historial

### Propósito

Registro completo de actividades: viajes, transacciones, cambios de estado, reportes y auditoría.

### Funcionalidades del Sistema

#### Registro de Actividades

- **Viajes**: Historial completo de todos los viajes
- **Transacciones**: Pagos, facturación, comisiones
- **Estados**: Cambios de estado de viajes, conductores, vehículos
- **Usuarios**: Actividades de login, cambios de perfil

#### Reportes y Análisis

- **Estadísticas**: Métricas de rendimiento por período
- **Gráficos**: Visualización de tendencias
- **Exportación**: PDF, Excel, CSV
- **Filtros**: Por fechas, usuarios, tipos de actividad

### Endpoints del Backend Requeridos

#### GET /api/history/travels

```json
// Response
{
  "history": [
    {
      "id": "history-123",
      "travelId": "travel-456",
      "userId": "user-789",
      "action": "travel_completed",
      "timestamp": "2024-06-15T16:30:00Z",
      "details": {
        "origin": "Bogotá",
        "destination": "Aeropuerto El Dorado",
        "duration": 45,
        "distance": 18.5,
        "amount": 45000,
        "driver": "Carlos Rodríguez",
        "rating": 5
      },
      "metadata": {
        "ip": "192.168.1.100",
        "userAgent": "Angular App v1.0"
      }
    }
  ],
  "pagination": {
    "total": 2547,
    "page": 1,
    "limit": 50
  }
}
```

#### GET /api/history/stats

#### GET /api/history/export

#### GET /api/history/activities

---

## 📄 Módulo de Facturas

### Propósito

Sistema completo de facturación: generación, gestión, estados, impuestos y reportes contables.

### Componentes Principales

#### InvoicesIndexComponent (`Pages/Invoices/Index/`)

- **Funcionalidad**: Lista principal de facturas
- **Características**: Filtros, búsqueda, paginación, estados

#### InvoiceDetailsComponent (`Pages/Invoices/Show/`)

- **Funcionalidad**: Vista detallada de factura
- **Características**: Información completa, acciones, historial

#### InvoiceCreateComponent (`Pages/Invoices/Create/`)

- **Funcionalidad**: Creación de nuevas facturas
- **Características**: Formulario multi-paso, cálculos automáticos

### Servicios

#### InvoicesService (`Services/Invoices/invoices.service.ts`)

- **Funcionalidades**: CRUD de facturas, cálculos, generación PDF

### Estados de Factura

```typescript
type InvoiceStatus =
  | "draft" // Borrador
  | "pending" // Pendiente de pago
  | "paid" // Pagada
  | "overdue" // Vencida
  | "cancelled"; // Cancelada
```

### Endpoints del Backend Requeridos

#### GET /api/invoices

```json
// Response
{
  "invoices": [
    {
      "id": "inv-123",
      "number": "FAC-2024-001",
      "customer": {
        "id": "customer-456",
        "name": "Empresa ABC S.A.",
        "email": "contabilidad@empresaabc.com",
        "taxId": "900123456-1"
      },
      "issueDate": "2024-06-15T10:00:00Z",
      "dueDate": "2024-07-15T23:59:59Z",
      "status": "pending",
      "items": [
        {
          "description": "Servicio de transporte ejecutivo",
          "quantity": 5,
          "unitPrice": 85000,
          "total": 425000
        }
      ],
      "subtotal": 425000,
      "tax": 80750,
      "total": 505750,
      "currency": "COP",
      "paymentTerms": "30 días",
      "notes": "Pago preferiblemente por transferencia bancaria"
    }
  ]
}
```

#### POST /api/invoices

#### GET /api/invoices/:id

#### PUT /api/invoices/:id

#### DELETE /api/invoices/:id

#### POST /api/invoices/:id/send-email

#### GET /api/invoices/:id/pdf

#### POST /api/invoices/:id/mark-paid

---

## 💳 Módulo de Métodos de Pago

### Propósito

Gestión completa de métodos de pago: tarjetas, cuentas bancarias, billeteras digitales y procesamiento.

### Componentes Principales

#### PaymentMethodsComponent (`Components/Payments/PaymentMethods/`)

- **Funcionalidad**: Lista de métodos de pago del usuario
- **Características**: Visualización, selección, gestión

#### PaymentMethodCardComponent (`Components/Payments/PaymentMethodCard/`)

- **Funcionalidad**: Tarjeta individual de método de pago
- **Características**: Información resumida, acciones rápidas

#### PaymentMethodModalComponent (`Components/Payments/PaymentMethodModal/`)

- **Funcionalidad**: Modal para agregar/editar métodos de pago
- **Características**: Formulario seguro, validaciones

### Servicios

#### PaymentsService (`Services/Payments/payments.service.ts`)

- **Funcionalidades**: CRUD de métodos de pago, procesamiento seguro

### Tipos de Métodos de Pago

```typescript
type PaymentMethodType =
  | "credit_card" // Tarjeta de crédito
  | "debit_card" // Tarjeta débito
  | "bank_account" // Cuenta bancaria
  | "digital_wallet" // Billetera digital
  | "cash"; // Efectivo
```

### Endpoints del Backend Requeridos

#### GET /api/payment-methods

```json
// Response
{
  "paymentMethods": [
    {
      "id": "pm-123",
      "type": "credit_card",
      "isDefault": true,
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expiryMonth": 12,
        "expiryYear": 2025,
        "holderName": "JUAN PEREZ"
      },
      "billingAddress": {
        "line1": "Carrera 15 #93-47",
        "city": "Bogotá",
        "country": "CO",
        "postalCode": "110111"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /api/payment-methods

#### DELETE /api/payment-methods/:id

#### POST /api/payment-methods/:id/set-default

#### POST /api/payments/process

---

## 📊 Dashboard y Panel de Control

### Propósito

Centro de comando con métricas, estadísticas, gráficos y accesos rápidos a funcionalidades principales.

### Componentes

#### DashboardComponent (`Pages/Dashboard/dashboard.component.ts`)

- **Funcionalidad**: Panel principal con widgets de información
- **Widgets incluidos**:
  - Resumen de viajes (activos, completados, cancelados)
  - Estadísticas financieras (ingresos, gastos, utilidades)
  - Rendimiento de conductores
  - Estado de vehículos
  - Facturas pendientes
  - Alertas y notificaciones

#### AdminDashboard (`Pages/Dashboard/admin.routes.ts`)

- **Funcionalidad**: Panel específico para administradores
- **Características**:
  - Métricas globales del sistema
  - Gestión de usuarios
  - Configuraciones generales
  - Reportes ejecutivos

### Layouts

#### MainComponent (`Layouts/App/main.component.ts`)

- **Propósito**: Estructura principal de la aplicación
- **Componentes**: Header, sidebar, contenido principal, footer

#### DashboardComponent (`Layouts/Dashboard/dashboard.component.ts`)

- **Propósito**: Layout específico para pantallas de dashboard
- **Características**: Sidebar expandible, breadcrumbs, notificaciones

### Endpoints del Backend Requeridos

#### GET /api/dashboard/stats

```json
// Response
{
  "travels": {
    "total": 1247,
    "active": 23,
    "completed": 1198,
    "cancelled": 26,
    "revenue": 45670000
  },
  "drivers": {
    "total": 45,
    "active": 38,
    "available": 12,
    "busy": 26,
    "averageRating": 4.6
  },
  "vehicles": {
    "total": 52,
    "available": 35,
    "inService": 15,
    "maintenance": 2
  },
  "invoices": {
    "pending": 15,
    "overdue": 3,
    "paid": 156,
    "totalPending": 8750000
  },
  "period": {
    "start": "2024-06-01T00:00:00Z",
    "end": "2024-06-30T23:59:59Z"
  }
}
```

---

## 🧩 Componentes UI Reutilizables

### BadgeComponent (`Components/Badge/`)

- **Propósito**: Etiquetas de estado y categorías
- **Uso**: Estados de viajes, roles de usuario, categorías

### CardComponent (`Components/Card/`)

- **Propósito**: Contenedor base para información
- **Uso**: Envolver contenido con estilos consistentes

### EmptyStateComponent (`Components/EmptyState/`)

- **Propósito**: Estado vacío cuando no hay datos
- **Uso**: Listas vacías, sin resultados de búsqueda

### LoaderComponent (`Components/Loader/`)

- **Propósito**: Indicador de carga
- **Uso**: Estados de loading en toda la aplicación

### SelectableCardComponent (`Components/SelectableCard/`)

- **Propósito**: Tarjetas seleccionables
- **Uso**: Selección de opciones, configuraciones

### Sidebar y Navegación

#### SidebarComponent (`Components/Sidebar/`)

- **Propósito**: Menú lateral principal
- **Características**: Navegación jerárquica, estados activos

#### NavLinksComponent (`Components/NavLinks/`)

- **Propósito**: Enlaces de navegación individuales
- **Características**: Estados activos, iconos, badges

---

## ⚙️ Servicios del Sistema

### TravelStatusService (`Services/TravelStatus/`)

- **Propósito**: Gestión de estados de viajes
- **Funcionalidades**: Cambios de estado, validaciones, notificaciones

### Patrones de Servicio

Todos los servicios siguen patrones consistentes:

```typescript
@Injectable({
  providedIn: "root",
})
export class ExampleService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Estado reactivo con signals
  private dataSignal = signal<Data[]>([]);
  public data = this.dataSignal.asReadonly();

  // Métodos CRUD estándar
  getAll(): Observable<Data[]>;
  getById(id: string): Observable<Data>;
  create(data: CreateData): Observable<Data>;
  update(id: string, data: UpdateData): Observable<Data>;
  delete(id: string): Observable<void>;
}
```

---

## 🛡️ Guards y Seguridad

### Sistema de Autorización

El sistema implementa un control de acceso robusto con múltiples niveles:

#### Autenticación Base

- Verificación de token JWT válido
- Restauración automática de sesión
- Redirección a login en caso de falta de autenticación

#### Control por Roles

- **Admin**: Acceso completo al sistema
- **Agency**: Gestión de viajes y clientes
- **Provider**: Gestión de flota y conductores

#### Seguridad de Rutas

```typescript
// Ejemplo de protección de rutas
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin'] }
}
```

---

## 🏗️ Layouts y Estructuras

### Estructura de Layouts

#### Layout Principal (`Layouts/App/`)

- Header con información de usuario
- Sidebar con navegación principal
- Área de contenido dinámico
- Footer con información adicional

#### Layout Dashboard (`Layouts/Dashboard/`)

- Optimizado para visualización de datos
- Widgets responsivos
- Navegación contextual

---

## 📋 Tipos y Definiciones

### Tipos Principales (`Types/index.d.ts`)

```typescript
// Usuario y autenticación
export type User = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};

export type Role = "admin" | "agency" | "provider";

export type UserCredentials = {
  email: string;
  password: string;
};

// Viajes
export type TravelStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

// Ubicaciones
export type Location = {
  name: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
};
```

---

## 🛠️ Utilidades

### Funciones Helper (`Utils/`)

- Formateo de fechas y monedas
- Validaciones de formularios
- Helpers de estado y navegación
- Utilidades de cálculo de precios

---

## 🔧 Requerimientos del Backend/API

### Estructura Base de Respuestas

Todas las respuestas del API deben seguir este formato:

```json
{
  "success": true,
  "data": {
    // Datos específicos del endpoint
  },
  "message": "Operación exitosa",
  "timestamp": "2024-06-15T10:30:00Z",
  "pagination": {
    // Solo en listados
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

### Autenticación

Todas las peticiones (excepto login) requieren:

```
Authorization: Bearer <jwt_token>
```

### Endpoints Críticos por Módulo

#### Autenticación

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/refresh`

#### Viajes

- `GET /api/travels` (con filtros)
- `POST /api/travels`
- `GET /api/travels/:id`
- `PUT /api/travels/:id`
- `POST /api/travels/:id/assign-driver`
- `POST /api/travels/:id/start`
- `POST /api/travels/:id/complete`

#### Conductores

- `GET /api/drivers`
- `GET /api/drivers/available`
- `POST /api/drivers`
- `PUT /api/drivers/:id`
- `GET /api/drivers/:id/stats`

#### Vehículos

- `GET /api/vehicles`
- `GET /api/vehicles/available`
- `POST /api/vehicles`
- `PUT /api/vehicles/:id`

#### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/charts`

---

## 🚀 Instalación y Desarrollo

### Requisitos Previos

- Node.js 18+
- Angular CLI 17+
- Git

### Instalación

```bash
git clone <repository-url>
cd mvp-frontend
npm install
ng serve
```

### Comandos Disponibles

```bash
npm start          # Servidor de desarrollo
npm test           # Ejecutar tests
npm run build      # Build de producción
npm run lint       # Linting del código
```

### Estructura de Desarrollo

```
src/app/
├── Components/     # Componentes reutilizables
├── Pages/         # Páginas de la aplicación
├── Services/      # Servicios y lógica de negocio
├── Guards/        # Guardias de autenticación
├── Layouts/       # Layouts y estructuras
├── Types/         # Definiciones de tipos
└── Utils/         # Utilidades y helpers
```

### Mejores Prácticas

- Uso de standalone components
- Reactive forms para formularios complejos
- Signals para estado reactivo
- Services con patrones observables
- Guards para protección de rutas
- TypeScript estricto

---

Esta documentación proporciona una visión completa del sistema, permitiendo que cualquier persona (técnica o no técnica) comprenda la funcionalidad, arquitectura y requerimientos del sistema de gestión de viajes y servicios.

- **Por qué**: Para obtener métodos de pago del usuario/empresa
- **Cómo**: Endpoint que retorna métodos de pago activos
- **Para qué**: Mostrar opciones de pago disponibles, permitir selección
- **Respuesta esperada**:

```json
{
  "paymentMethods": [
    {
      "id": "pm-001",
      "type": "visa",
      "name": "Visa •••• 4532",
      "details": "Vence 12/2026 • Juan Pérez",
      "isDefault": true,
      "isActive": true,
      "expiryDate": "12/2026",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 4,
  "defaultMethod": {
    "id": "pm-001",
    "type": "visa",
    "name": "Visa •••• 4532"
  }
}
```

#### 2. **POST /api/payment-methods**

- **Por qué**: Para agregar nuevos métodos de pago
- **Cómo**: Endpoint que procesa y almacena nuevos métodos de pago
- **Para qué**: Permitir a usuarios añadir tarjetas, cuentas bancarias, etc.

#### 3. **PUT /api/payment-methods/:id**

- **Por qué**: Para actualizar métodos de pago existentes
- **Cómo**: Endpoint que modifica información de métodos de pago
- **Para qué**: Cambiar método predeterminado, actualizar información

#### 4. **DELETE /api/payment-methods/:id**

- **Por qué**: Para eliminar métodos de pago
- **Cómo**: Endpoint que marca como inactivo o elimina el método
- **Para qué**: Remover métodos de pago obsoletos o no deseados

### Endpoints de Autenticación

#### 1. **POST /api/auth/login**

- **Por qué**: Para autenticar usuarios en el sistema
- **Cómo**: Endpoint que valida credenciales y retorna token
- **Para qué**: Control de acceso y personalización por usuario

#### 2. **GET /api/auth/me**

- **Por qué**: Para obtener información del usuario autenticado
- **Cómo**: Endpoint que retorna datos del usuario basado en el token
- **Para qué**: Mostrar información del usuario, determinar permisos

---

## 🏗 Arquitectura del Sistema

### Estructura de Carpetas

```
src/app/
├── Components/           # Componentes reutilizables
│   ├── Badge/           # Indicadores de estado
│   ├── Card/            # Contenedores de información
│   ├── InvoiceCard/     # Tarjetas de factura
│   ├── Payments/        # Módulo completo de pagos
│   └── Sidebar/         # Navegación lateral
├── Pages/               # Páginas principales
│   └── Invoices/        # Módulo de facturas
│       ├── Index/       # Lista de facturas
│       └── Show/        # Detalle de factura
├── Services/            # Lógica de negocio
│   ├── Auth/           # Autenticación
│   ├── Invoices/       # Gestión de facturas
│   └── Payments/       # Gestión de pagos
├── Guards/             # Protección de rutas
├── Types/              # Definiciones de tipos
└── Utils/              # Utilidades generales
```

---

## 📄 Módulo de Facturas

### ¿Qué es y para qué sirve?

El módulo de facturas es el núcleo del sistema que permite gestionar todo el ciclo de vida de las facturas: desde la creación hasta el pago y seguimiento.

### Componentes Principales

#### 1. **InvoiceHeaderComponent**

**Ubicación**: `Pages/Invoices/Index/partials/header/`

**¿Qué hace?**

- Muestra estadísticas generales de facturas (total, pagadas, pendientes, en revisión)
- Presenta las facturas más recientes
- Para usuarios tipo "agencia", muestra métodos de pago disponibles
- Permite navegación rápida a detalles de facturas

**¿Cómo funciona internamente?**

1. Al iniciarse, carga datos del usuario autenticado
2. Solicita estadísticas de facturas al servicio
3. Obtiene las 3 facturas más recientes
4. Si el usuario es tipo "agencia", carga componente de métodos de pago
5. Actualiza la interfaz cuando los datos están listos

**Datos que maneja**:

- Estadísticas: números totales y montos
- Facturas recientes: lista de las últimas facturas
- Estado de carga: indicador de si está procesando datos
- Información del usuario: roles y permisos

#### 2. **InvoiceCardComponent**

**Ubicación**: `Components/InvoiceCard/`

**¿Qué hace?**

- Muestra información resumida de una factura en formato de tarjeta
- Indica el estado visual de la factura (pagada, pendiente, etc.)
- Permite navegación al detalle de la factura
- Adapta su apariencia según el estado

**¿Cómo funciona internamente?**

1. Recibe datos de una factura como entrada
2. Utiliza utilidades de estado para determinar colores y texto
3. Formatea fechas y montos para presentación
4. Maneja eventos de clic para navegación

**Información que muestra**:

- Número de factura
- Cliente
- Fecha de emisión
- Monto total
- Estado actual (con colores distintivos)

### Estados de Facturas

El sistema maneja diferentes estados con significados específicos:

- **Borrador (draft)**: Factura en preparación, no enviada
- **Pendiente (pending)**: Enviada al cliente, esperando pago
- **En Revisión (review)**: Requiere verificación adicional
- **Pagada (paid)**: Pago completado y verificado
- **Vencida (overdue)**: Pasó la fecha de vencimiento sin pago
- **Cancelada (cancelled)**: Factura anulada

### Filtros y Búsqueda

La página principal permite filtrar facturas por:

- Estado (todos, pendientes, pagadas, etc.)
- Rango de fechas
- Cliente
- Monto mínimo/máximo

---

## 💳 Módulo de Métodos de Pago

### ¿Qué es y para qué sirve?

Es un sistema completo para gestionar formas de pago que permite a los usuarios (especialmente agencias) administrar sus métodos de pago de manera segura y eficiente.

### Arquitectura Modular

#### 1. **PaymentMethodsComponent** (Componente Principal)

**Ubicación**: `Components/Payments/`

**¿Qué hace?**

- Coordina todo el módulo de métodos de pago
- Muestra lista de métodos disponibles
- Permite seleccionar método activo
- Gestiona creación, edición y eliminación

**¿Cómo funciona internamente?**

1. Al iniciarse, carga métodos de pago del servicio
2. Presenta opciones de configuración (mostrar header, permitir edición, etc.)
3. Coordina con componentes hijos para acciones específicas
4. Emite eventos a componentes padre cuando hay cambios
5. Gestiona estados de carga y errores

**Propiedades configurables**:

- `showHeader`: Mostrar/ocultar encabezado
- `allowSelection`: Permitir seleccionar métodos
- `allowEdit`: Permitir editar métodos
- `maxMethods`: Límite máximo de métodos

#### 2. **PaymentMethodCardComponent**

**Ubicación**: `Components/Payments/payment-method-card/`

**¿Qué hace?**

- Muestra información de un método de pago individual
- Indica si está seleccionado o es predeterminado
- Muestra alertas de expiración para tarjetas
- Proporciona botones de acción (editar, eliminar, establecer predeterminado)

**¿Cómo funciona internamente?**

1. Recibe datos de un método de pago
2. Utiliza utilidades para mostrar iconos y colores apropiados
3. Verifica fechas de expiración y muestra alertas
4. Gestiona eventos de usuario (clic, editar, eliminar)
5. Aplica estilos visuales según estado

**Estados visuales**:

- **Seleccionado**: Borde azul, fondo destacado
- **Predeterminado**: Badge "Predeterminado"
- **Expirado**: Badge rojo de alerta
- **Próximo a expirar**: Badge amarillo de advertencia

#### 3. **PaymentMethodModalComponent**

**Ubicación**: `Components/Payments/payment-method-modal/`

**¿Qué hace?**

- Formulario para crear o editar métodos de pago
- Validación de datos según tipo de método
- Manejo de errores de formulario
- Experiencia de usuario fluida con carga

**¿Cómo funciona internamente?**

1. Se configura en modo "crear" o "editar"
2. Carga tipos de métodos de pago disponibles
3. Inicializa formulario con datos existentes (modo edición)
4. Valida campos según reglas de negocio
5. Envía datos al servicio y gestiona respuesta
6. Emite eventos de éxito o error al componente padre

**Validaciones implementadas**:

- Nombre y detalles requeridos
- Fecha de expiración para tarjetas
- Formato correcto de fecha (MM/YY)
- Verificación de fecha no vencida

### Tipos de Métodos de Pago Soportados

#### 1. **Tarjetas de Crédito/Débito**

- **Visa**: Icono 💳, color azul
- **Mastercard**: Icono 💳, color naranja
- **Otros**: Personalizable

**Campos requeridos**:

- Nombre (ej: "Visa •••• 4532")
- Detalles (ej: "Vence 12/2026 • Juan Pérez")
- Fecha de expiración (MM/YY)

#### 2. **Billeteras Digitales**

- **PayPal**: Icono 🟦, color azul
- **Otros**: Expandible

**Campos requeridos**:

- Nombre del servicio
- Email o identificador asociado

#### 3. **Transferencias Bancarias**

- **Banco**: Icono 🏦, color púrpura

**Campos requeridos**:

- Nombre del banco
- Número de cuenta (parcial por seguridad)

#### 4. **Efectivo**

- **Efectivo**: Icono 💵, color verde

**Uso típico**:

- Pagos al conductor
- Pagos en persona

### Seguridad y Mejores Prácticas

#### Datos Sensibles

- **Nunca** se almacenan números completos de tarjeta
- Solo se muestran últimos 4 dígitos
- Información de CVV jamás se guarda
- Fechas de expiración para validación únicamente

#### Flujo de Seguridad Recomendado

1. Frontend captura datos mínimos
2. Backend procesa con gateway de pago seguro
3. Se almacena solo token/referencia
4. Frontend muestra información parcial

---

## 🎨 Componentes UI

### BadgeComponent

**Propósito**: Mostrar estados, etiquetas y notificaciones

**Variantes disponibles**:

- `primary`: Azul, para información general
- `success`: Verde, para estados exitosos
- `warning`: Amarillo, para advertencias
- `danger`: Rojo, para errores o alertas
- `secondary`: Gris, para información secundaria

**Uso típico**:

```html
<cp-badge [label]="'Pagada'" [variant]="'success'" [size]="'sm'"> </cp-badge>
```

### CardComponent

**Propósito**: Contenedor visual con espaciado y estilos consistentes

**Configuraciones**:

- `variant`: Estilo del contenedor
- `padding`: Espaciado interno (sm, md, lg)
- `size`: Tamaño del contenedor
- `hoverable`: Efectos al pasar mouse

**Uso típico**:

```html
<cp-card [variant]="'default'" [padding]="'md'" [hoverable]="true">
  <!-- Contenido aquí -->
</cp-card>
```

---

## ⚙️ Servicios

### InvoicesService

**Ubicación**: `Services/Invoices/`

**Responsabilidades**:

- Comunicación con API de facturas
- Cache local de datos
- Gestión de estados de carga
- Transformación de datos

**Métodos principales**:

- `getInvoices()`: Lista paginada de facturas
- `getInvoiceById(id)`: Factura específica
- `getInvoiceStats()`: Estadísticas resumidas
- `createInvoice(data)`: Nueva factura
- `updateInvoice(id, data)`: Actualizar factura

**Estados que maneja**:

```typescript
{
  invoices: Invoice[],
  isLoading: boolean,
  error: string | null,
  currentPage: number,
  totalPages: number
}
```

### PaymentsService

**Ubicación**: `Services/Payments/`

**Responsabilidades**:

- CRUD de métodos de pago
- Validaciones de negocio
- Gestión de método predeterminado
- Cálculos y estadísticas

**Métodos principales**:

- `getPaymentMethods()`: Lista de métodos activos
- `createPaymentMethod(data)`: Nuevo método
- `updatePaymentMethod(id, data)`: Actualizar método
- `deletePaymentMethod(id)`: Eliminar método
- `setDefaultPaymentMethod(id)`: Establecer predeterminado

**Lógica de negocio implementada**:

- Solo un método puede ser predeterminado
- No se puede eliminar el único método activo
- Validación de fechas de expiración
- Verificación de métodos duplicados

### AuthService

**Ubicación**: `Services/Auth/`

**Responsabilidades**:

- Autenticación de usuarios
- Gestión de tokens
- Información de usuario actual
- Control de sesiones

**Flujo de autenticación**:

1. Usuario envía credenciales
2. Servicio valida con backend
3. Almacena token de forma segura
4. Mantiene estado de usuario
5. Renueva automáticamente si es necesario

---

## 🛡️ Guards y Autenticación

### AuthGuard

**Propósito**: Proteger rutas que requieren autenticación

**¿Cómo funciona?**

1. Intercepta navegación a rutas protegidas
2. Verifica si existe token válido
3. Si no está autenticado, redirige a login
4. Si está autenticado, permite acceso

### RoleGuard

**Propósito**: Control de acceso basado en roles

**Roles del sistema**:

- **admin**: Acceso completo, todas las funciones
- **agency**: Gestión de facturas y pagos, vista completa
- **provider**: Acceso limitado, solo consulta

**¿Cómo funciona?**

1. Verifica autenticación del usuario
2. Obtiene roles del usuario actual
3. Compara con roles requeridos para la ruta
4. Permite o deniega acceso según correspondencia

**Configuración en rutas**:

```typescript
{
  path: 'invoices',
  component: InvoicesComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { requiredRoles: ['admin', 'agency'] }
}
```

---

## 🔧 Instalación y Desarrollo

### Requisitos Previos

- Node.js 18+
- npm 9+
- Angular CLI 17+

### Instalación

```bash
# Clonar repositorio
git clone [url-del-repositorio]
cd mvp-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuraciones necesarias
```

### Desarrollo

```bash
# Servidor de desarrollo
npm start
# o
ng serve

# Navegar a http://localhost:4200/
```

### Build de Producción

```bash
# Build optimizado
npm run build
# o
ng build --prod

# Archivos generados en dist/
```

### Testing

```bash
# Tests unitarios
npm test

# Tests e2e
npm run e2e

# Coverage
npm run test:coverage
```

### Estructura de Configuración

#### Variables de Entorno

```env
API_BASE_URL=https://api.ejemplo.com
AUTH_TOKEN_KEY=auth_token
PAYMENT_GATEWAY_URL=https://pagos.ejemplo.com
```

#### Configuración Angular

- **Desarrollo**: `environment.ts`
- **Producción**: `environment.prod.ts`
- **Testing**: `environment.test.ts`

---

## 📚 Casos de Uso Comunes

### Para Administradores

1. **Ver dashboard completo**: Acceso a todas las estadísticas y facturas
2. **Gestionar cualquier factura**: Crear, editar, eliminar facturas
3. **Configurar métodos de pago**: Administrar métodos de toda la organización

### Para Agencias

1. **Gestionar sus facturas**: Ver, crear y editar facturas propias
2. **Seleccionar método de pago**: Elegir entre métodos disponibles
3. **Administrar métodos propios**: Añadir, editar métodos de pago

### Para Proveedores

1. **Consultar facturas asignadas**: Solo lectura de facturas específicas
2. **Ver estado de pagos**: Información de pagos recibidos

---

## 🚀 Extensibilidad Futura

### Funcionalidades Planificadas

- **Notificaciones en tiempo real**: WebSockets para actualizaciones
- **Informes avanzados**: Gráficos y análisis detallados
- **Integración con más gateways**: Stripe, Square, etc.
- **Facturas recurrentes**: Automatización de facturación
- **Multi-moneda**: Soporte para diferentes divisas

### Puntos de Extensión

- **Nuevos tipos de métodos de pago**: Criptomonedas, etc.
- **Flujos de aprobación**: Workflows personalizables
- **Integraciones contables**: QuickBooks, SAP, etc.
- **APIs de terceros**: Servicios de validación, etc.

---

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 17.3.7.

## Desarrollo

Ejecutar `ng serve` para servidor de desarrollo. Navegar a `http://localhost:4200/`. La aplicación se recargará automáticamente si modificas archivos fuente.

## Build

Ejecutar `ng build` para construir el proyecto. Los artefactos se almacenarán en el directorio `dist/`.

## Tests

Ejecutar `ng test` para tests unitarios via [Karma](https://karma-runner.github.io).

## Ayuda Adicional

Para más ayuda sobre Angular CLI usar `ng help` o revisar [Angular CLI Overview and Command Reference](https://angular.io/cli).
