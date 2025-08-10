# Dockerfile para Frontend Angular - Izytracking
# Optimizado para producción en render.com

# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@17

# Instalar dependencias (npm install puede resolver dependencias desincronizadas)
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir aplicación para producción
RUN ng build --configuration=production

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine AS production

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos desde builder (ruta debe coincidir con outputPath en angular.json)
COPY --from=builder /app/dist/mvp-frontend /usr/share/nginx/html

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nginx
RUN adduser -S angular -u 1001

# Cambiar permisos
RUN chown -R angular:nginx /usr/share/nginx/html
RUN chown -R angular:nginx /var/cache/nginx
RUN chown -R angular:nginx /var/log/nginx
RUN chown -R angular:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R angular:nginx /var/run/nginx.pid

# Cambiar a usuario no-root
USER angular

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
