# Guia de instalacion

Esta guia resume las herramientas necesarias y los pasos basicos para preparar el entorno de FECU desde cero.

## 1. Requisitos globales

- **Node.js 20+**: instala desde https://nodejs.org o via nvm.
- **Corepack** (incluido desde Node 16.13): habilita `pnpm` con `corepack enable`.
- **PNPM 9+**: se activa automaticamente con Corepack; verifica con `pnpm -v`.
- **Prisma CLI**: se instala como dependencia del proyecto (`pnpm exec prisma ...`), no requiere instalacion global.
- **Git**: para clonar el repositorio.

Recomendados:

- **Supabase CLI** (opcional) si deseas administrar buckets o policies desde la terminal.
- **Docker** (opcional) para ejecutar Postgres local o levantar el servicio en contenedores.

## 2. Clonar el proyecto

```bash
git clone https://github.com/slider66/fecu.git
cd fecu
```

## 3. Instalar dependencias

```bash
pnpm install
```

Este comando descarga todas las dependencias listadas en `package.json`, incluyendo `prisma`, `next`, `react` y librerias de UI.

## 4. Variables de entorno

1. Duplica `.env.example` como `.env`.
2. Completa las claves de Supabase, base de datos y correo segun tu entorno.
3. Mantener el archivo `.env` fuera del control de versiones.

## 5. Inicializar Prisma

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev   # usa db push si prefieres evitar migraciones locales
```

Si tienes la base lista (por ejemplo, en staging/produccion) usa:

```bash
pnpm exec prisma migrate deploy
```

## 6. Ejecutar el proyecto

```bash
pnpm dev
# Visita http://localhost:3000
```

Para modo produccion:

```bash
pnpm build
pnpm start
```

## 7. Comandos utiles

- `pnpm lint`: ejecuta ESLint.
- `pnpm exec prisma studio`: abre el visualizador de datos en el navegador.
- `pnpm dlx tsx scripts/seed.ts`: inserta datos de prueba si la tabla `Photo` esta vacia.

## 8. Verificacion rapida

1. Carga una orden de prueba en `/upload`.
2. Revisa que aparezca en `/orden` y `/gallery`.
3. Si configuraste correo, confirma que llegue la notificacion interna.
4. Observa la consola para verificar que no existan errores de Prisma o Supabase.

Con estos pasos deberias tener el servicio en marcha en cualquier equipo que cumpla los requisitos globales.

## 9. Automatizacion rapida

- `pnpm dlx tsx scripts/migrate.ts`: ejecuta la generacion del cliente Prisma y aplica migraciones.
- `pnpm dlx tsx scripts/deploy.ts`: instala dependencias, corre migraciones y construye el build listo para produccion.
