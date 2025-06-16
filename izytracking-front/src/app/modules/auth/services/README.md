# Servicios de Autenticación

Este folder contiene los servicios relacionados con la autenticación y la gestión de sesión de usuario.

## Servicios principales

### AuthenticationService

- Permite login y logout de usuarios.
- Gestiona el usuario actual y su persistencia en localStorage.
- Proporciona un observable para el usuario actual.

### SessionService

- Servicio base para gestionar la sesión del usuario.
- Puede ser extendido para almacenar información adicional de sesión.

## Ejemplo de uso

```typescript
constructor(private authService: AuthenticationService) {}

this.authService.login('usuario', 'contraseña').subscribe();
```
