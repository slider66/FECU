# Arquitectura

## Panorama general

FECU es una aplicación **Next.js 15 (App Router)** orientada a registrar evidencia fotográfica del ingreso y la salida de equipos en un servicio técnico. Se ejecuta como una aplicación monolítica con front-end y API en el mismo repositorio.

Componentes principales:

- **Front-end React 19** con páginas `app/` (landing, carga, consulta y galería).
- **API Route `/api/photos`** para recepción de formularios con imágenes.
- **Prisma ORM** conectado a **PostgreSQL** (Prisma Accelerate/Direct URL).
- **Supabase Storage** para persistir los archivos de imagen.
- **Nodemailer** para notificaciones opcionales vía Gmail.

## Flujo de datos

```
Usuario → Formulario `/upload`
        → POST /api/photos
        → Supabase Storage (imagenes)
        → Prisma → Postgres (metadatos)
        → Revalidate { /gallery, /orden }
        → Respuesta JSON + Toast
```

## Front-end

- **App Router** organiza la experiencia en directorios auto-contenidos.
  - `app/page.tsx`: landing con accesos directos a los flujos clave.
  - `app/upload/page.tsx`: formulario principal (`RepairUploadForm`).
  - `app/orden/page.tsx`: consulta filtrada por número de reparación.
  - `app/gallery/page.tsx`: vista general de las últimas capturas.
- **Design System** custom en `components/` con wrappers de UI.
- **Validación** `react-hook-form` + `zod` para validar campos y archivos antes del submit.
- **Feedback** mediante `sonner` y estados locales (`useState`).

## Backend y APIs

- **`POST /api/photos`** recibe `FormData` con:
  - `repairNumber`, `stage`, `technician`, `comments`, `images[]`.
  - Valida obligatoriedad, extensiones y tamaño máximo.
  - Genera nombres únicos y sube cada archivo a Supabase Storage (`repair-photos`).
  - Persiste metadatos en `Photo` via Prisma.
  - Revalida páginas estáticas relacionadas (`/gallery`, `/orden`).
  - Dispara correo opcional con miniaturas si hay credenciales Gmail.
- El endpoint es **serverless ready** y puede ejecutarse en Vercel/Node 20.

## Persistencia

- **Base de datos**: tabla `photos` mapeada por Prisma (`model Photo`).
- **Storage**: bucket público `repair-photos` en Supabase. La URL pública se guarda en `Photo.path`.
- **Indices**: `bucketPath` único para prevenir duplicados.

## Servicios externos

| Servicio   | Uso                                   | Configuración clave                           |
|------------|----------------------------------------|-----------------------------------------------|
| Supabase   | Storage público de imágenes            | `NEXT_PUBLIC_SUPABASE_URL`, claves publishable y service role |
| PostgreSQL | Metadatos de fotos vía Prisma          | `DATABASE_URL`, `DIRECT_URL`                  |
| Gmail      | Notificaciones internas opcionales     | `GOOGLE_EMAIL`, `GOOGLE_APP_PASSWORD`         |

## Consideraciones de seguridad

- Bucket público: solo se exponen rutas absolutas, no se almacenan credenciales en responses.
- El endpoint limita tipos MIME y tamaño por archivo.
- `SUPABASE_SERVICE_ROLE_KEY` debe mantenerse fuera del front-end (solo en el servidor).
- Recomendado montar el API detrás de autenticación si se requiere control de accesos.

## Próximos pasos sugeridos

- Añadir autenticación para restringir accesos a `/upload`.
- Implementar rate limiting o captcha para mitigar abuso del endpoint.
- Registrar logs estructurados en un servicio centralizado (p.ej. Logflare).
