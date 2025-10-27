# Solución de problemas

Guía rápida para resolver problemas frecuentes al ejecutar o desplegar FECU.

## Errores comunes

- **`NEXT_PUBLIC_SUPABASE_URL is not defined`**
  - Verifica que `.env` contiene todas las variables y que reiniciaste el servidor tras cambiarlas.
- **Subida de fotos falla con `400`**
  - Revisa que `stage` sea `ENTRY` o `EXIT` y que se envíe al menos una imagen válida.
- **`SUPABASE_SERVICE_ROLE_KEY` inválida**
  - Confirma que usas la clave de servicio (dashboard de Supabase → Settings → API).
- **Correo no enviado**
  - Asegúrate de haber configurado `GOOGLE_EMAIL` y `GOOGLE_APP_PASSWORD` y de permitir apps menos seguras vía App Password.
- **`prisma migrate deploy` sin efecto**
  - Comprueba que la base de datos esté accesible desde el entorno y que la URL use SSL cuando el proveedor lo requiera.

## Limpieza y reset

- Para rehacer la base en desarrollo puedes ejecutar `pnpm exec prisma migrate reset`.
- Si subiste archivos de prueba, elimínalos desde el panel de Supabase (bucket `repair-photos`).

## Diagnóstico recomendado

- Ejecuta `pnpm lint` antes de hacer commit.
- Activa `prisma` logs (ya configurados en `lib/prisma.ts`) y revisa la consola para detectar queries lentas.
- Usa el inspector de red del navegador para revisar peticiones `POST /api/photos`.

## Ayuda adicional

- Prisma docs: https://www.prisma.io/docs
- Supabase Storage: https://supabase.com/docs/guides/storage
- Next.js App Router: https://nextjs.org/docs/app

Si encuentras un problema nuevo, por favor documenta la solución en este archivo tras resolverlo.
