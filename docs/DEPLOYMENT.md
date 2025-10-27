# Despliegue

Esta guía resume cómo preparar e integrar FECU en distintos entornos: desarrollo local, servidores tradicionales, plataformas serverless y despliegues basados en contenedores.

## 1. Prerrequisitos

- Node.js 20 o superior.
- Gestor de paquetes `pnpm`.
- Proyecto Supabase con bucket público `repair-photos`.
- Base de datos PostgreSQL accesible (Prisma Accelerate o instancia propia).
- Cuenta Gmail con App Password (opcional para alertas internas).

## 2. Preparación de variables de entorno

1. Duplica `.env.example` como `.env` (o `.env.local` en Vercel) y completa cada variable.
2. Evita exponer `SUPABASE_SERVICE_ROLE_KEY` en el cliente; resérvala para procesos de backend.
3. Versiona solo la plantilla para que el resto del equipo conozca las claves necesarias.
4. En proveedores gestionados define las variables desde su panel (Vercel, Render, Railway, Fly.io, etc.).

## 3. Integración según el entorno

### 3.1 Desarrollo local

1. Clona el repositorio y entra al directorio del proyecto.
2. Instala dependencias: `pnpm install`.
3. Inicializa la base de datos:
   ```bash
   pnpm exec prisma generate
   pnpm exec prisma migrate dev     # o pnpm exec prisma db push
   ```
4. Inicia el servidor: `pnpm dev` y accede a `http://localhost:3000`.
5. (Opcional) Ejecuta `pnpm dlx tsx scripts/seed.ts` para insertar datos de ejemplo cuando la tabla está vacía.

### 3.2 Servidor propio o máquina virtual (PM2/systemd)

1. Instala Node.js 20 y `pnpm` en la máquina.
2. Copia el repositorio (git pull o rsync) a una ruta como `/var/www/fecu`.
3. Configura las variables de entorno vía `.env`, `/etc/environment` o un gestor de secretos (Vault, Doppler, etc.).
4. Ejecuta:
   ```bash
   pnpm install --frozen-lockfile
   pnpm exec prisma migrate deploy
   pnpm build
   ```
5. Usa PM2 (`pm2 start pnpm --name fecu -- start`) o un servicio `systemd` para dejar corriendo `pnpm start`.
6. Coloca un proxy inverso (Nginx/Traefik) para manejar HTTPS y la terminación TLS.

### 3.3 Staging o QA

- Replica la configuración de producción con credenciales propias para base de datos, storage y correo.
- Usa buckets separados (`repair-photos-staging`) para no mezclar evidencia real con datos de pruebas.
- Protege el entorno con autenticación básica o VPN si es solo para el equipo interno.
- Automatiza los despliegues desde una rama `staging` y sincroniza bases con `pnpm exec prisma migrate deploy`.

### 3.4 Producción en Vercel, Render u otra plataforma serverless

1. Conecta el repositorio al proveedor.
2. Declara las variables de entorno en el panel del proyecto (en Vercel: *Project Settings → Environment Variables*).
3. Mantén `pnpm install` como comando de instalación y `pnpm build` como comando de build.
4. Para Render, Fly.io u opciones similares crea un servicio Node que ejecute `pnpm start` tras compilar.
5. Configura dominios y revisa las políticas CORS del bucket de Supabase si el dominio público cambia.

### 3.5 Despliegue con contenedores (Docker / Kubernetes)

1. Define un `Dockerfile` de ejemplo:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package.json pnpm-lock.yaml ./
   RUN corepack enable && pnpm install --frozen-lockfile
   COPY . .
   RUN pnpm build
   CMD ["pnpm", "start"]
   ```
2. Construye la imagen: `docker build -t fecu:latest .`
3. Inyecta las variables de entorno mediante `docker-compose`, `kubectl` o el orquestador que uses.
4. Ejecuta las migraciones antes de levantar el contenedor de aplicación (`pnpm exec prisma migrate deploy` en un job/init container).
5. Expone el puerto 3000 y orquesta el tráfico con tu balanceador (Ingress Nginx, Traefik, AWS ALB, etc.).

## 4. Configuración de Supabase Storage

1. Crea el bucket `repair-photos` (puedes agregar sufijos por entorno).
2. Márcalo como público para permitir la visualización de imágenes.
3. Ajusta las reglas de acceso y CORS según los dominios desde los que se sirva la aplicación.

## 5. Inicialización de la base de datos

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy   # o pnpm exec prisma db push en desarrollo
```

También puedes automatizar la secuencia con `pnpm dlx tsx scripts/migrate.ts`.

## 6. Construcción y despliegue manual

```bash
pnpm build
pnpm start   # inicia la aplicación en modo producción
```

- En Vercel, el proceso se ejecuta automáticamente en cada push.
- En servidores tradicionales, agrupa los comandos en un script o pipeline de despliegue.

## 7. Verificación post-despliegue

- Probar los flujos `/upload`, `/orden` y `/gallery`.
- Validar que las imágenes se guardan correctamente en Supabase.
- Revisar que la revalidación incremental (ISR) actualiza las vistas después de cada carga.
- Enviar un correo real si la funcionalidad de notificaciones está habilitada.

## 8. Observabilidad y mantenimiento

- Activa los logs del proveedor (Vercel/Render) o envíalos a tu stack de observabilidad.
- Supervisa métricas de almacenamiento y ancho de banda en Supabase.
- Revisa `CHANGELOG.md` en cada release para conocer migraciones u operaciones adicionales.
- Añade monitoreo de salud (pings HTTP, alertas, dashboards) cuando el sistema crezca.

## 9. Automatización CI/CD

- El flujo `.github/workflows/ci.yml` ejecuta `pnpm lint`. Amplíalo con pruebas unitarias, de integración y builds si lo requieres.
- Define pipelines separados para staging y producción, con aprobaciones manuales donde sea necesario.
