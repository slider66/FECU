# Bautizo Iago · Galería de Recuerdos

Aplicación web para compartir y gestionar las fotos del Bautizo de Iago. Permite a los invitados subir sus recuerdos de forma sencilla y segura, y a los organizadores moderar y visualizar el álbum completo.

## Características clave

- **Subida Optimizada**: Compresión de imágenes en el cliente (ahorro de datos y batería) y subida masiva eficiente.
- **Experiencia de Usuario**: Barra de progreso real, protección contra cierres accidentales y diseño "mobile-first".
- **Gestión de Evento**: Identificación automática del evento (`BAUTIZO-IAGO-2025`).
- **Seguridad**: Panel de administración protegido para moderación de contenido.
- **Galería Dinámica**: Visualización fluida de fotos con carga diferida.
- **Notificaciones**: Alertas por correo (opcional) con resumen de nuevas subidas.

## Stack tecnico

- **Framework**: Next.js 15 (App Router, Turbopack).
- **Lenguaje**: TypeScript + React 19.
- **Estilos**: Tailwind CSS 4 y componentes propios (`components/ds`).
- **Formularios**: React Hook Form, Zod, Sonner.
- **Iconos y UI**: Lucide, componentes reutilizables en `components/ui`.
- **Persistencia**: Prisma ORM 6 con Prisma Accelerate (PostgreSQL gestionado por Prisma).
- **Storage**: Supabase Storage (bucket publico `repair-photos`).
- **Correo**: Nodemailer (Gmail) opcion para alertas internas.

## Estructura del proyecto

```
FECU/
├─ app/                     # Rutas Next.js (App Router)
│  ├─ page.tsx              # Landing + accesos rapidos a ingreso/salida
│  ├─ upload/               # Formulario principal de captura
│  ├─ orden/                # Consulta por numero de reparacion
│  └─ gallery/              # Galeria general
├─ components/              # Design system, wrappers de layout y UI
├─ lib/                     # Prisma, transporte de correo, utilidades
├─ prisma/                  # schema.prisma y migraciones
├─ public/                  # Assets estaticos
├─ utils/                   # Clientes auxiliares (Supabase, etc.)
└─ README.md
```

## Flujo principal

1. Desde la pagina inicial se ingresa el numero de reparacion y se elige registrar ingreso o salida.
2. En `/upload` se capturan o seleccionan imagenes, indicando etapa, tecnico y comentarios relevantes.
3. El backend sube los archivos a Supabase Storage, guarda metadatos en PostgreSQL y revalida las vistas.
4. Tecnicos y clientes consultan en `/orden?repairNumber=XXXX` o revisan la galeria `/gallery`.

## Requisitos previos

- Node.js v20 o superior.
- pnpm instalado globalmente (`npm install -g pnpm` si es necesario).
- Proyecto Supabase con bucket publico `repair-photos` (solo para almacenamiento de imagenes).
- Cuenta Gmail con app password (opcional) si se desean alertas por correo.

## Configuracion inicial

```bash
git clone https://github.com/slider66/fecu.git
cd FECU
pnpm install
```

Duplicar `.env.example` como `.env` y completar:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
DIRECT_URL=postgres://...@db.prisma.io:5432/postgres?sslmode=require

GOOGLE_EMAIL=...            # opcional
GOOGLE_APP_PASSWORD=...     # opcional
```

Sincronizar el esquema:

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

Iniciar el servidor de desarrollo:

```bash
pnpm dev
# Navega a http://localhost:3000
```

Para una guia paso a paso que incluye requisitos previos, instalacion de dependencias y verificaciones finales consulta `docs/SETUP.md`. Para escenarios de despliegue en distintos entornos revisa `docs/DEPLOYMENT.md`.

## Comandos utiles

```bash
pnpm dev                  # Servidor de desarrollo (Turbopack)
pnpm build                # Compilacion para produccion
pnpm start                # Servidor en modo produccion
pnpm lint                 # Analisis con ESLint
pnpm exec prisma studio   # Explorar registros con Prisma Studio
pnpm dlx tsx scripts/migrate.ts  # Ejecutar migraciones en cadena
pnpm dlx tsx scripts/deploy.ts   # Instalar deps, migrar y generar build para despliegue
```

## Notas y recomendaciones

- Prisma apunta a Prisma Accelerate. Si prefieres usar Postgres de Supabase, reemplaza `DATABASE_URL` y `DIRECT_URL` por la cadena de Supabase y vuelve a ejecutar `pnpm exec prisma db push`.
- El bucket `repair-photos` debe ser publico; si cambias el nombre, actualiza `next.config.ts` y `app/api/photos/route.ts`.
- Las notificaciones via correo solo se envian cuando `GOOGLE_EMAIL` y `GOOGLE_APP_PASSWORD` estan definidos.
- Se mantiene texto en ASCII simple para evitar problemas de encoding en dispositivos o CLI.

## Licencia

MIT
