# Docker Troubleshooting Guide

Esta guía cubre problemas comunes al ejecutar la aplicación con Docker y sus soluciones.

## Problemas Comunes

### 1. Error: "Cannot connect to the Docker daemon"

**Síntoma**: Al ejecutar `docker-compose`, aparece un error indicando que no se puede conectar al daemon de Docker.

**Solución**:

- Asegúrate de que Docker Desktop esté corriendo
- En Windows, verifica que el servicio de Docker esté activo en el administrador de tareas
- Reinicia Docker Desktop si es necesario

### 2. Puerto ya en uso

**Síntoma**: Error como `bind: address already in use` o `port is already allocated`.

**Causa**: Otro proceso está usando uno de los puertos (3000, 3001, 3002, 3003, 5432, 5433, 8080).

**Solución**:

**Windows**:

```powershell
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000
# Matar el proceso (reemplaza PID con el ID del proceso)
taskkill /PID <PID> /F
```

**Linux/Mac**:

```bash
# Ver qué proceso usa el puerto 3000
lsof -i :3000
# Matar el proceso
kill -9 <PID>
```

O cambia los puertos en el archivo `.env` y en `docker-compose.yaml`.

### 3. Migraciones de Prisma fallan

**Síntoma**: Error al ejecutar `docker-compose exec api-auth pnpm prisma:test_micro:deploy`.

**Causa**: La base de datos no está lista o hay problemas de conexión.

**Solución**:

```bash
# Verificar que PostgreSQL esté corriendo y saludable
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres-main
docker-compose logs postgres-netflix

# Esperar más tiempo y reintentar (las bases de datos pueden tardar en iniciar)
sleep 30
docker-compose exec api-auth pnpm prisma:test_micro:deploy
```

### 4. Los servicios se caen constantemente (crash loop)

**Síntoma**: Los contenedores se reinician continuamente.

**Solución**:

```bash
# Ver logs del servicio problemático
docker-compose logs -f api-auth

# Causas comunes:
# 1. Variable de entorno faltante o incorrecta
# 2. Base de datos no disponible
# 3. Error en el código

# Ejecutar el servicio en primer plano para ver errores
docker-compose up api-auth
```

### 5. Build de imágenes Docker falla

**Síntoma**: Error durante `docker-compose build`.

**Causa común**: Falta de espacio en disco, problemas de red, o archivos corruptos.

**Solución**:

```bash
# Limpiar caché de Docker
docker system prune -a

# Reconstruir sin caché
docker-compose build --no-cache

# Verificar espacio en disco
df -h  # Linux/Mac
```

### 6. No se puede conectar a la base de datos desde los microservicios

**Síntoma**: Error `connect ECONNREFUSED` o similar.

**Causa**: Problema de red Docker o configuración incorrecta de DATABASE_URL.

**Solución**:

```bash
# Verificar que las bases de datos estén en la misma red
docker network inspect signoz-net

# Verificar variables de entorno del servicio
docker-compose exec api-auth env | grep DATABASE_URL

# La URL debe usar el nombre del servicio Docker, no localhost:
# ✅ Correcto: postgresql://postgres:root@postgres-main:5432/test_micro
# ❌ Incorrecto: postgresql://postgres:root@localhost:5432/test_micro
```

### 7. API Gateway no puede conectarse a los microservicios

**Síntoma**: Error de timeout o conexión rechazada desde el API Gateway.

**Causa**: Configuración incorrecta de `SERVICE_HOST` o los microservicios no están corriendo.

**Solución**:

```bash
# Verificar que todos los microservicios estén healthy
docker-compose ps

# En Docker, el API Gateway debe usar los nombres de servicio:
# SERVICE_HOST debe configurarse para usar 'host.docker.internal'

# Verificar conectividad desde el gateway
docker-compose exec api-gateway ping api-auth
```

### 8. SigNoz no muestra traces

**Síntoma**: No aparecen traces en el dashboard de SigNoz.

**Causa**: OpenTelemetry Collector no está recibiendo datos o los servicios no están instrumentados.

**Solución**:

```bash
# Verificar que otel-collector esté corriendo
docker-compose logs otel-collector

# Verificar variables OTEL en los servicios
docker-compose exec api-auth env | grep OTEL

# URLs correctas para Docker:
# OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
# OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://otel-collector:4318/v1/traces
```

### 9. Cambios en el código no se reflejan

**Síntoma**: Modificas el código pero los cambios no aparecen.

**Causa**: La imagen Docker necesita ser reconstruida.

**Solución**:

```bash
# Reconstruir la imagen del servicio específico
docker-compose build api-auth

# Reconstruir y reiniciar
docker-compose up -d --build api-auth

# Para desarrollo activo, considera usar desarrollo local sin Docker
```

### 10. Problemas de permisos (Linux/Mac)

**Síntoma**: Errores de permisos al acceder a volúmenes.

**Solución**:

```bash
# Ver el propietario de los volúmenes
docker volume inspect nx-micro-postgres-main-data

# Cambiar permisos si es necesario
sudo chown -R $USER:$USER /var/lib/docker/volumes/
```

## Comandos Útiles de Diagnóstico

### Ver todos los contenedores (incluso detenidos)

```bash
docker-compose ps -a
```

### Ver uso de recursos

```bash
docker stats
```

### Inspeccionar un servicio

```bash
docker-compose exec api-auth sh
# Dentro del contenedor:
node -v
npm -v
env | grep DATABASE
```

### Reiniciar un servicio específico

```bash
docker-compose restart api-auth
```

### Ver logs en tiempo real

```bash
docker-compose logs -f --tail=100
```

### Eliminar todo y empezar de cero

```bash
# ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
docker-compose down -v
docker system prune -a
docker volume prune
docker-compose build --no-cache
docker-compose up -d
```

## Verificación de Health

Puedes verificar el health de cada servicio con:

```bash
# API Gateway
curl http://localhost:3000/api/services/health

# Microservicios directamente (si tienen endpoint de health)
curl http://localhost:3001/health  # api-auth
curl http://localhost:3002/health  # netflix
curl http://localhost:3003/health  # csv-processor

# PostgreSQL
docker-compose exec postgres-main pg_isready -U postgres
docker-compose exec postgres-netflix pg_isready -U postgres
```

## Contacto y Soporte

Si encuentras un problema que no está listado aquí, por favor:

1. Revisa los logs con `docker-compose logs -f`
2. Verifica las configuraciones en `.env` y `docker-compose.yaml`
3. Abre un issue en el repositorio con los logs relevantes
