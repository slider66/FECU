# Arquitectura

## Panorama general

**Bautizo Iago** es una aplicación **Next.js 15 (App Router)** diseñada para recopilar y compartir recuerdos fotográficos del evento. Se ejecuta como una aplicación monolítica optimizada para móviles.

Componentes principales:

- **Front-end React 19** con páginas `app/` (landing, carga, consulta y galería).
- **API Route `/api/photos`** para recepción masiva de imágenes.
- **Prisma ORM** conectado a **PostgreSQL** (Prisma Accelerate/Direct URL).
- **Supabase Storage** para persistir los archivos de imagen.
- **Nodemailer** para notificaciones opcionales vía Gmail.

## Flujo de datos

```
Usuario → Formulario `/upload` (Compresión Cliente)
        → POST /api/photos (Multipart)
        → Supabase Storage (imágenes en paralelo)
        → Prisma → Postgres (createMany - batch insert)
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

### Ejemplo de políticas para Supabase Storage

1. Crea el bucket `repair-photos` marcado como público para lectura.
2. Define políticas en `storage.objects` que limiten la escritura a un rol de servicio y expongan solo la lectura pública:

```sql
-- Lectura pública (solo bucket repair-photos)
create policy "public-read-repair-photos"
on storage.objects for select
using (bucket_id = 'repair-photos');

-- Inserción desde la API (role service o funciones)
create policy "service-write-repair-photos"
on storage.objects for insert
with check (
  bucket_id = 'repair-photos'
  and auth.role() in ('service_role', 'authenticated')
);

-- Eliminación restringida
create policy "service-delete-repair-photos"
on storage.objects for delete
using (
  bucket_id = 'repair-photos'
  and auth.role() = 'service_role'
);
```

3. Configura CORS para permitir únicamente los dominios oficiales y métodos `GET`.

### Rate limiting recomendado para `/api/photos`

Aun cuando el endpoint no se expone públicamente, es buena práctica limitar los envíos por IP/orden. Un enfoque sencillo es usar `@upstash/ratelimit` en `middleware.ts`:

```ts
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 uploads por minuto
  prefix: "fecu-api-photos"
});

export async function middleware(request: Request) {
  if (request.nextUrl.pathname === "/api/photos") {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Demasiadas cargas seguidas, intenta de nuevo en un minuto." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset)
          }
        }
      );
    }
  }

  return NextResponse.next();
}
```

Adapta la ventana y el proveedor de almacenamiento (Upstash, Redis propio, KV) según la infraestructura. Para entornos sin middleware se puede envolver la lógica dentro del handler de `POST /api/photos`.

## Próximos pasos sugeridos

- Añadir autenticación para restringir accesos a `/upload`.
- Implementar rate limiting o captcha para mitigar abuso del endpoint.
- Registrar logs estructurados en un servicio centralizado (p.ej. Logflare).
