# Control de Reparaciones

Aplicacion web construida con Next.js para documentar el estado de los equipos que ingresan y egresan del servicio tecnico. Permite capturar fotos con la camara del movil o importar desde la galeria, almacenarlas en Supabase Storage y consultarlas mas tarde por numero de reparacion.

## Caracteristicas

- Registro de ingreso y salida por numero de reparacion.
- Captura directa desde camara (`capture="environment"`) o seleccion desde la galeria.
- Validacion de peso, formato y cantidad maxima de imagenes (12 por envio).
- Almacenamiento automatico en Supabase Storage (`repair-photos`) y metadatos en PostgreSQL via Prisma.
- Busqueda publica por numero de reparacion con agrupacion de fotos por etapa (ingreso/salida).
- Galeria general con las ultimas evidencias subidas.
- Notificacion opcional por correo via Nodemailer (Gmail) con miniaturas de las imagenes.

## Stack Tecnico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Base de datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage (`repair-photos`)
- **Formularios**: React Hook Form + Zod
- **UI**: Componentes personalizados con Radix UI + Tailwind
- **Iconos**: Lucide
- **Email** (opcional): Nodemailer (Gmail)
- **Analitica**: Vercel Analytics

## Requisitos Previos

- Node.js v20 o superior
- npm o yarn
- Cuenta de Supabase con una base de datos PostgreSQL
- Bucket de almacenamiento publico llamado `repair-photos` en Supabase Storage
- (Opcional) Cuenta de Gmail con app password para los correos de alerta

## Puesta en Marcha

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd FECU
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raiz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_public_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

   DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19zNU5ERVNYTXo1cnJJTHRLUDRQbjAiLCJhcGlfa2V5IjoiMDFLOEpURzRDTUtENjRBQjkxVkZCNEFYQVkiLCJ0ZW5hbnRfaWQiOiI4YzkzZGZiZThhYjJiYjQyMjNhMTgxYjA4YTlkNTBmNmNiODNmYzM2ZGU3NWRmMTBkNzMzZTYyOWZkMjdkYzQzIiwiaW50ZXJuYWxfc2VjcmV0IjoiMzk0ZTdhOTktMzg4NS00OTU4LWEwNWYtMmZkZjM5MjAyMWE1In0.XO4v-h3vCp0HAXlxmMGAzt5rgJ7TnLMoTnd-V4P7pLg
   DIRECT_URL=postgres://8c93dfbe8ab2bb4223a181b08a9d50f6cb83fc36de75df10d733e629fd27dc43:sk_s5NDESXMz5rrILtKP4Pn0@db.prisma.io:5432/postgres?sslmode=require

   GOOGLE_EMAIL=tu_correo@gmail.com        # Opcional (alertas por mail)
   GOOGLE_APP_PASSWORD=tu_app_password     # Opcional
   ```

4. **Preparar Prisma**
   ```bash
   pnpm exec prisma generate
   pnpm exec prisma db push
   ```

5. **Iniciar el entorno de desarrollo**
   ```bash
   pnpm dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) para ver la aplicacion.

## Flujo de Uso

1. Desde la pagina principal ingresa el numero de reparacion y elige si registrar ingreso o salida.
2. Toma fotos con la camara o selecciona desde la galeria. Puedes subir hasta 12 imagenes por envio (8 MB maximo cada una).
3. Las fotos quedan alojadas en Supabase Storage y registradas en la base de datos con la etapa correspondiente.
4. Consulta el historial desde la pagina **/orden** introduciendo el mismo numero de reparacion. Las imagenes aparecen agrupadas por ingreso y salida.
5. Usa la galeria general para revisar rapidamente las ultimas evidencias cargadas por el equipo tecnico.

## Scripts Disponibles

```bash
pnpm dev       # Servidor de desarrollo con Turbopack
pnpm build     # Compilacion para produccion
pnpm start     # Servidor de produccion
pnpm lint      # Analisis con ESLint
```

## Notas de Implementacion

- El bucket de Supabase debe ser publico y llamarse `repair-photos`. Si cambias el nombre, actualiza la constante en `app/api/photos/route.ts` y `next.config.ts`.
- El esquema de Prisma define el enum `RepairStage` con valores `ENTRY` y `EXIT`. Asegurate de ejecutar `pnpm exec prisma generate` despues de modificar el esquema.
- Para habilitar los correos, completa `GOOGLE_EMAIL` y `GOOGLE_APP_PASSWORD`. Si no esten definidos, el envio se omite silenciosamente.
- Los textos se encuentran en español neutro sin acentos para mantener compatibilidad ASCII.
- Los botones de captura usan `capture="environment"` para sugerir la camara trasera en dispositivos moviles compatibles.

## Licencia

MIT
